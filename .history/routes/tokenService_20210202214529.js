

router.post('/upload', upload.single('document'), async function (req, res) {
    if(req.file) {
      try{
        const base64 = await encodeFileToBase64(req.file)
        const fileId = await fileCreate(JSON.stringify(base64));
        res.json(fileId);
      }catch(err){
        console.log('error in upload',err)
      }
    }
    else throw 'error';
});