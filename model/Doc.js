import mongoose from '@/db/mongo';


const docSchema = new mongoose.Schema({
    title: String,
    url: String,
  });

const DocModel = mongoose.models.Doc || mongoose.model('Doc', docSchema);

export default DocModel;