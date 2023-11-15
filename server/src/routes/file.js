const router = require('express').Router();
const conf = require('../config/get').fetch();
//AWS S3 CONFIG
const aws = require('aws-sdk');
const S3_BUCKET = process.env.S3_BUCKET_NAME;
const S3_ACCESSKEY = process.env.S3_ACCESSKEY;
const S3_SECRET = process.env.AWS_SECRET_ACCESS_KEY;
aws.config.region = 'us-east-1';
aws.config.update({ accessKeyId: S3_ACCESSKEY, secretAccessKey: S3_SECRET });

// var util = require('../lib/util.js');

router.get('/', function (req, res, next) {
  res.render('index', { title: 'API V1 - File' });
});

router.get('/sign', function (req, res, next) {
  var fileName = req.query.filename;
  var fileType = req.query.filetype;
  var fileParts = fileType.split('/');
  var fileEnding;
  // console.log('Creating URL for File....')
  if (fileParts.length > 1) {
    fileEnding = fileParts[1];
  }
  var userID = req.user.id;

  if (!fileName || !fileType || !userID || !fileEnding) {
    res.status(422).send({
      error:
        'Missing Parameters. Make sure you provide filename and filetype. ex {image/png}',
    });
    return;
  }
  var currentTimestamp = Date.now();
  var fileLocation = `user-uploads/${userID}/${fileName}-${currentTimestamp}.${fileEnding}`;
  const s3 = new aws.S3();
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileLocation,
    Expires: 1000,
    ContentType: fileType,
    ACL: 'public-read',
  };
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(400).send({ error: err });
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileLocation}`,
    };
    res.status(200).send({ data: returnData, success: true });
  });
});

module.exports = {
  baseUrl: '/file',
  router,
  auth: true,
};
