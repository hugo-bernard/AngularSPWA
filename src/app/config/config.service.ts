import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ConfigService {
    constructor(private http: HttpClient) { }
    baseUrl = "https://blog-wt4-rwl6t.ondigitalocean.app/api/"

    getQuestions() {
        return this.http.get(this.baseUrl + "questions");
    }

    getUsers() {
        return this.http.get(this.baseUrl + "users");
    }

    register(data: {
        "name": string,
        "email": string,
        "password": string
    }) {
        return this.http.post(this.baseUrl + "auth/register", data);
    }

    login(data: {
        "email": string,
        "password": string
    }) {
        return this.http.post(this.baseUrl + "auth/login", data);
    }

    getUser(id: string) {
        return this.http.get(`${this.baseUrl}users/${id}/`);
    }

    getUserFromToken(token: string) {
        const headers = {'Content-Type': 'application/json','Authorization': 'Bearer ' + token};
        return this.http.get(`${this.baseUrl}auth/me`, {headers: headers});
    }

    upvote(token: string, question_id: string, answer_id: string) {
        const headers = {'Content-Type': 'application/json','Authorization': 'Bearer ' + token};
        return this.http.post(this.baseUrl + `questions/${question_id}/answers/${answer_id}/upvote`,{}, {headers: headers});
    }

    approve(token: string, question_id: string, answer_id: string) {
        const headers = {'Content-Type': 'application/json','Authorization': 'Bearer ' + token};
        return this.http.post(this.baseUrl + `questions/${question_id}/answers/${answer_id}/approve`, {}, {headers:headers});
    }

    postQuestion(data: {
        "title": string,
        "description": string
    }) {
        return this.http.post(this.baseUrl + "questions", data);
    }

    postAnswer(token: string, ans_id: string, data: {
        "answer": string,
    }) {
        const headers = {'Content-Type': 'application/json','Authorization': 'Bearer ' + token};
        return this.http.post(this.baseUrl + "questions/"+ans_id+"/answers", data, {headers: headers});
    }

    getQuestion(id: string) {
        return this.http.get(`${this.baseUrl}questions/${id}`);
    }

    getComments(token: string, question_id:string, ans_id: string) {
        const headers = {'Content-Type': 'application/json','Authorization': 'Bearer ' + token};
        return this.http.get(`${this.baseUrl}questions/${question_id}/answers/${ans_id}/comments`, {headers: headers});
    }
}