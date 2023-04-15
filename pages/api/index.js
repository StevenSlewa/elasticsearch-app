import { Client } from '@elastic/elasticsearch'
import DocModel from '../../model/Doc'
import formidable from "formidable";
import fs from "fs";

const client = new Client({
  cloud: {
  id: process.env.CLOUD_ID
  },
  auth: {
    apiKey:process.env.AUTH_API_KEY
  }
});

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {

  if (req.method === 'GET') {
    const { q } = req.query;

    if (!q) {
      const docs = await DocModel.find();
      return res.status(200).json(docs);
    }
    if (q === '') {
      return res.status(200).json([]);
    }

    try {
      const body = await client.search({
        index: 'docs',
        body: {
          "query": {
            "bool": {
              "should": [
                {
                  "match_phrase_prefix": {
                    "attachment.content": {
                      "query": `${q}`,
                    }
                  }
                },
                {
                  "match_phrase_prefix": {
                    "title": {
                      "query": `${q}`,
                    }
                  }
                }
              ]
            }

          },

        }
      });

      const data = body.hits.hits.map(e => ({ _id: e._id, title: e._source?.title ?? '', attachment: e._source?.attachment ?? ''}));

      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }


  else if (req.method === 'POST') {

    const form = formidable({ multiples: true });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    });

    for (let fileKey in files) {
      let file = files[fileKey];

      const doc = new DocModel({
        title: file.originalFilename,
      });
      const savedDoc = await doc.save();

      const pdfPath = `./public/files/${savedDoc._id}.pdf`;
      const data = fs.readFileSync(file.filepath);
      fs.writeFileSync(pdfPath, data);
      fs.unlinkSync(file.filepath);

      await DocModel.updateOne({ _id: savedDoc._id }, { url: pdfPath });

      await createPipeline();
      await client.index({
        index: 'docs',
        id: savedDoc._id,
        pipeline: 'pdf-attachment',
        document: {
          attachment: data.toString('base64'),
          title: savedDoc.title,
        },
      });

      await client.indices.refresh({ index: 'docs' })
    }

    res.status(200).json('savedDoc');
  }
}

const createPipeline = async () => {
  const pipeID = 'pdf-attachment'
  try {
    await client.ingest.getPipeline({ id: 'pipeID' });
  } catch (error) {
    if (error.statusCode !== 404) {
      throw error;
    }
  }

  await client.ingest.putPipeline({
    id: pipeID,
    body: {
      description: 'Extract attachment information from PDF files',
      processors: [
        {
          attachment: {
            field: 'attachment',
            indexed_chars: -1,
            ignore_missing: true,
          },
        },
      ],
    },
  });
};
