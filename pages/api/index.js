import { Client } from '@elastic/elasticsearch'
import DocModel from '../../model/Doc'
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false
  }
};


const client = new Client({
  cloud: {
    id: 'elastic-search-app:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyRmMTlkZWQ2YzEzOTM0NzM2YmVlZDM2YTcyODBlNjc1MiRkMDFhM2UwYTU4MjA0MTdhYjdiM2Y3ZDUyZGM3ODA1OA=='
  },
  auth: {
    apiKey: 'M2hkYWNJY0I1Y0xaT3NCZ2FqV2s6MUdBSDVRRmtReVNlZW9PVjN4ZmFBdw=='
  }
});



export default async function handler(req, res) {

  if (req.method === 'GET') {

    const { q } = req.query;

    if (!q) {
      const docs = await DocModel.find();
      res.status(200).json(docs);
    }

    try {
      const body = await client.search({
        index: 'docs',
        body: {
          "query": {
            "match_phrase_prefix": {
              "title": {
                "query": `${q}`,
                //  "fuzziness":"AUTO",
              }
            }
          }
        }
      });

      console.log(body)

      const data = body.hits.hits.map(e => ({ id: e._id, title: e._source.title }));


      res.status(200).json(data);
    } catch (error) {
      console.error(error);
    res.status(500).json({ error: 'Internal server error' });
    }
  }
  else if (req.method === 'POST') {



    const form = formidable({ multiples: true });
    let result = form.parse(req, async function (err, fields, files) {

      const doc = new DocModel({
        title: files.file.originalFilename,
      });

      const savedDoc = await doc.save();

      const data = fs.readFileSync(files.file.filepath);
      fs.writeFileSync(`./public/${savedDoc._id}.pdf`, data);
      fs.unlinkSync(files.file.filepath);

      await DocModel.updateOne({ _id: savedDoc._id }, { url: `./public/${savedDoc._id}.pdf` });

      await createPdfPipeline();
      const body = await client.index({
        index: 'docs',
        id: savedDoc._id,
        pipeline: 'pdf',
        body: {
          title: savedDoc.title,
          attachment: {
            content_type: 'application/pdf',
            content: data.toString('base64'),
          },
        },
      });

      return savedDoc;

    });

    res.status(200).json(result);
  }
}

async function createPdfPipeline() {
  const pipeline = {
    description: 'Extract text from PDF files',
    processors: [
      {
        attachment: {
          field: 'attachment',
        },
      },
    ],
  };

  try {
    const { body: response } = await client.ingest.getPipeline({ id: 'pdf' });
    console.log('Pipeline already exists:', response);
    return;
  } catch (error) {
    if (error.statusCode !== 404) {
      throw error;
    }
  }

  const { body: response } = await client.ingest.putPipeline({ id: 'pdf', body: pipeline });

  console.log('Pipeline created:', response);
}
