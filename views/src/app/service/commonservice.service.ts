import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

const apiUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class CommonserviceService {

  public httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }
  constructor(private http: HttpClient) {

  }
  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
  ////////////////////////////////////////// restfull service call started ///////////////////////////////////////

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  getAllCall(actionURL): Observable<any> {

    return this.http.get<any>(apiUrl + '/' + actionURL).pipe(
      tap(_ => true),
      catchError(this.handleError<any>(`failed`))
    );
  }

  getFcmCall(actionURL): Observable<any> {
    return this.http.get<any>(actionURL).pipe(
      tap(_ => true),
      catchError(this.handleError<any>(`failed`))
    );
  }

  locationgetAllCall(actionURL): Observable<any> {
    return this.http.get<any>(actionURL).pipe(
      tap(_ => true),
      catchError(this.handleError<any>(`failed`))
    );
  }

  getCallByID(actionURL, id): Observable<any> {
    const url = `${apiUrl}/${actionURL}/${id}`;
    return this.http.get<any>(url).pipe(
      tap(_ => console.log(`success`)),
      catchError(this.handleError<any>(`failed`))
    );
  }

  postCall(actionURL, data): Observable<any> {
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    return this.http.post<any>(apiUrl + '/' + actionURL, data, this.httpOptions).pipe(
      tap((data: any) => console.log(`success`)),
      catchError(this.handleError<any>('failed'))
    );
  }

  updateCall(actionURL, id, data): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.http.put(url + '/' + actionURL, data, this.httpOptions).pipe(
      tap(_ => console.log(`success`)),
      catchError(this.handleError<any>('failed'))
    );
  }

  deleteCallByID(actionURL, id): Observable<any> {
    const url = `${apiUrl}/${actionURL}/${id}`;
    return this.http.delete<any>(url, this.httpOptions).pipe(
      tap(_ => console.log(`success`)),
      catchError(this.handleError<any>('failed'))
    );
  }

  sendMessage(actionURL, data): Observable<any> {
    const httpOption = {
      headers: new HttpHeaders({ 'Content-Type': 'text/plain' })
    };
    return this.http.post<any>(apiUrl + '/' + actionURL, data, httpOption).pipe(
      tap(_ => console.log(`success`)),
      catchError(this.handleError<any>('failed'))
    );
  }

  ////////////////////////////////////////// restfull service call ended///////////////////////////////////////

  elasticQueryFormatter(data) {
    var resultObj = {
      total: 0,
      data: {},
      aggregations: {}
    }

    if (data.httpCode === 200) {
      var arrayData = JSON.parse(data.result);
      var totalRecords = arrayData.hits.total ? arrayData.hits.total.value : 0;
      var records = arrayData.hits.hits;
      var aggregations = arrayData.aggregations ? arrayData.aggregations : {};
      var count = 0;
      var tempData = []
      for (var i = 0; i < records.length; i++) {
        if (records[i]['_id'] != '_search') {
          records[i]['_source']['_id'] = records[i]['_id'];
          tempData.push(records[i]['_source']);
        } else {
          count++;
        }
      }

      totalRecords = totalRecords > 0 ? totalRecords - count : 0
      var dataArray = [];
      for (var i = 0; i < records.length; i++) {
        dataArray.push(records[i]._source)
      }
      resultObj = {
        "total": totalRecords,
        "data": {
          "recordsTotal": totalRecords,
          "recordsFiltered": totalRecords,
          "data": dataArray
        },
        aggregations: aggregations
      }

      return resultObj;

    } else {

      return resultObj;
    }

  };
}
