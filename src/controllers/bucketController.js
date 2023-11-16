/**
 * Copyright (c) 2020, 2021 Oracle and/or its affiliates.  All rights reserved.
 * This software is dual-licensed to you under the Universal Permissive License (UPL) 1.0 as shown at https://oss.oracle.com/licenses/upl or Apache License 2.0 as shown at http://www.apache.org/licenses/LICENSE-2.0. You may choose either license.
 */

/* @param args Arguments to provide to the example. The following arguments are expected:
 * <ul>
 * <li>The first argument is the OCID of the compartment.</li>
 * <li>The second is the name of bucket to create and later fetch</li>
 * <li>The third is the name of object to create inside bucket</li>
 * <li>The fourth is the path of the file. i.e: "/Users/File/location";
 * </ul>
 * Note: there is a 2GB for 64-bit machine and 1GB for 32-bit machine buffer limitation from the NodeJS V8 Engine
 * Cannot upload file size greater than the limit
 */

import os from "oci-objectstorage";
import common from "oci-common";
import fs from "fs";

const compartmentId = "ocid1.tenancy.oc1..aaaaaaaaw23kqle6g4sesdfdqyozydjd4tbu5pi5tccbmqqy3lptn4vv4oqa";
const bucket = "tutorial-bucket";
const namespace = "axioynhey0yi";

const provider = new common.ConfigFileAuthenticationDetailsProvider(
  "~/.oci/config",
  "DEFAULT"
);

const client = new os.ObjectStorageClient({
  authenticationDetailsProvider: provider
});


class BucketController {
  // ------------------------------------------------------------------------ GET /buckets
  async getAllBuckets(req, res) {
    const provider = new common.ConfigFileAuthenticationDetailsProvider(
      "~/.oci/config",
      "DEFAULT"
    );
    const client = new os.ObjectStorageClient({
      authenticationDetailsProvider: provider
    });
    const namespace = "axioynhey0yi";

    try {
      const request = {
        namespaceName: namespace
      };
      const response = await client.listBuckets(request);
      console.log("List Buckets executed successfully" + response);
      return res.status(200).json(response);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async postFile(req, res) {
    try {
      console.log(req.body);
      const object = req.body.objectName;
      const fileLocation = req.body.fileUrl;
      // Download the file from the URL
      const response = await fetch(fileLocation);
      const fileContent = await response.blob();

      // Convert the file content to a base64 encoded string
      const base64EncodedFileContent = await fileContent.arrayBuffer().then((buffer) =>
        Buffer.from(buffer).toString('base64')
      );

      console.log("Bucket is created. Now adding object to the Bucket.");
      const putObjectRequest = {
        namespaceName: namespace,
        bucketName: bucket,
        putObjectBody: fileContent,
        objectName: object,
        contentType: 'application/octet-stream',
      };
      const putObjectResponse = await client.putObject(putObjectRequest);
      console.log("Put Object executed successfully" + putObjectResponse);

      console.log("Fetch the object created");
      const getObjectRequest = {
        objectName: object,
        bucketName: bucket,
        namespaceName: namespace
      };
      return res.status(200).json(
        { 
          message: 'File uploaded successfully',
          bucket: getObjectRequest
        }
        );
    } catch (error) {
      console.log("Error executing example " + error);
      return res.status(500).json({error: 'Internal Server Error'});
    }
  }
}

export default BucketController;