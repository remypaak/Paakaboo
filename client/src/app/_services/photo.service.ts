import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
    private http = inject(HttpClient);
    baseUrl = environment.apiUrl;


    submitPhoto(photo: File, title: string)
    {
        const formData = new FormData();
        formData.append('file', photo)
        formData.append('title', title)
        return this.http.post(this.baseUrl + 'photo/submit-photo', formData)
    }

}
