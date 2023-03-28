const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var keyTokenSchema = new mongoose.Schema(
   {
      userId: [{ type: mongoose.Types.ObjectId, ref: 'Shop' }],
      publicKey: {
         type: String,
         required: true,
      },
   },
   {
      timestamps: true,
   }
);

//Export the model
module.exports = mongoose.model('keyToken', keyTokenSchema);
