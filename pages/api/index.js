import { Client } from '@elastic/elasticsearch'
import DocModel from '../../model/Doc'
import formidable from "formidable";
import fs from "fs";




// TODO MOVE KEYS TO ENV
// TODO FIX ARCHITECTURE
const client = new Client({
  cloud: {
    id: 'elastic-search-app:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyRmMTlkZWQ2YzEzOTM0NzM2YmVlZDM2YTcyODBlNjc1MiRkMDFhM2UwYTU4MjA0MTdhYjdiM2Y3ZDUyZGM3ODA1OA=='
  },
  auth: {
    apiKey: 'M2hkYWNJY0I1Y0xaT3NCZ2FqV2s6MUdBSDVRRmtReVNlZW9PVjN4ZmFBdw=='
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

    try {
      const body = await client.search({
        index: 'docs',
        body: {
          "query": {
            "match_phrase_prefix": {
              "attachment": {
                "content": {
                  "query": `${q}`,
                  //  "fuzziness":"AUTO",
                }
              }
            }
          }
        }
      });

      console.log(body)

      const data = body.hits.hits.map(e => ({ _id: e._id, title: e._source.title }));

      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }


  else if (req.method === 'POST') {


    const form = formidable({ multiples: true });
    console.log("first")

    const result = form.parse(req, async (err, fields, files) => {
      try {
        console.log(err)

        const doc = new DocModel({
          title: files.file.originalFilename,
        });
        console.log(await doc.save(), "okok")
        const savedDoc = await doc.save();

        console.log("ffsec")


        const pdfPath = `./public/files/${savedDoc._id}.pdf`;
        const data = fs.readFileSync(files.file.filepath);
        fs.writeFileSync(pdfPath, data);
        fs.unlinkSync(files.file.filepath);


        await DocModel.updateOne({ _id: savedDoc._id }, { url: pdfPath });

        await createPipeline();
        console.log("second")
        await client.index({
          index: 'docs',
          id: savedDoc._id,
          pipeline: 'pdf-attachment',
          document: {
            attachment: data.toString('base64'),
            title: savedDoc.title,
          },
        });
        console.log("third")

        await client.indices.refresh({ index: 'docs' })
      }
      catch (error) {
        console.log(error)

      }

    });


    res.status(200).json(result);
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
        // {
        //   remove: {
        //     field: 'attachment',
        //   },
        // },
      ],
    },
  });
};
