import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Photo } from '../_models/photo';
import { tap } from 'rxjs';
import { PhotoWithVotes } from '../_models/photoWithVotes';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
    private http = inject(HttpClient);
    baseUrl = environment.apiUrl;
    submittedPhoto = signal<Photo | null>(null)


    submitPhoto(photo: File, title: string, theme: string)
    {
        const formData = new FormData();
        formData.append('file', photo)
        formData.append('title', title)
        formData.append('theme', theme)
        return this.http.post<Photo>(this.baseUrl + 'photo/submit-photo', formData ).pipe(
            tap((photo) => this.submittedPhoto.set(photo))
        )
    }

    getPhotoForActiveTheme(theme: string)
    {
        return this.http.get<Photo>(this.baseUrl + 'photo/' + theme).pipe(
            tap(photo => {
                this.submittedPhoto.set(photo);
            })
        )
    }

    getAllPhotosForActiveTheme(theme: string){
        return this.http.get<Photo[]>(this.baseUrl + 'photo/all/' + theme)
    }

    getPhotosWithVotes(themeId: number){
        return this.http.get<PhotoWithVotes[]>(this.baseUrl + 'photo/photos-with-votes/' + themeId)
    }

}
