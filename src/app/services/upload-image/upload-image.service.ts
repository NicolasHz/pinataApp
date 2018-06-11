import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import 'firebase/storage';
import { FirebaseApp } from 'angularfire2';
import { User } from '../../interfaces/user';

@Injectable()
export class UploadImageService {

  constructor(private http: HttpClient, private fs: FirebaseApp) { }

  uploadImage(image: File, subFolder: string, name: string): Promise<string> {
    const storageRef = this.fs.storage().ref('usersImages/').child(subFolder).child(name);
    return storageRef.put(image).then(snapshot => {
      return snapshot.metadata.downloadURLs[0];
    });
  }

  getImage(id: string): Observable<Blob> {
    return this.http.get(id, {responseType: 'blob'});
  }

  digestImage(imageBlob) {
    return new File([imageBlob], 'user-image', {type: imageBlob.type, lastModified: Date.now()});
  }
}
