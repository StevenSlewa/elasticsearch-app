
export default async function handler(req, res) {

    const { download } = req.query;

    res.status(200).json([download]);

}
