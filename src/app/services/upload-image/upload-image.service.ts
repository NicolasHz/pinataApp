import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import 'firebase/storage';
import { FirebaseApp } from 'angularfire2';

@Injectable()
export class UploadImageService {

  constructor(private http: HttpClient, private fs: FirebaseApp) { }

  uploadImage(image: File, subFolder: string, name: string): Promise<string> {
    const storageRef = this.fs.storage().ref('usersImages/').child(subFolder).child(name);
    return storageRef.put(image).then((snapshot) => {
      return snapshot.metadata.downloadURLs[0];
    });
  }

}
