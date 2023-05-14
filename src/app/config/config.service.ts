import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ConfigService {
    constructor(private http: HttpClient) { }
    baseUrl = "https://blog-wt4-rwl6t.ondigitalocean.app/api/"

    // Get all questions
    getQuestions() {
        return this.http.get(this.baseUrl + "questions");
    }

    // Get all users
    getUsers() {
        return this.http.get(this.baseUrl + "users");
    }

    // register and get an access token
    register(data: {
        "name": string,
        "email": string,
        "password": string
    }) {
        return this.http.post(this.baseUrl + "auth/register", data);
    }

    // login and get an access token
    login(data: {
        "email": string,
        "password": string
    }) {
        return this.http.post(this.baseUrl + "auth/login", data);
    }

    // get User from id
    getUser(token: string, id: string) {
        const headers = {'Content-Type': 'application/json','Authorization': 'Bearer ' + token};
        return this.http.get(`${this.baseUrl}users/${id}/`, {headers: headers});
    }

    // get User from access token
    getUserFromToken(token: string) {
        const headers = {'Content-Type': 'application/json','Authorization': 'Bearer ' + token};
        return this.http.get(`${this.baseUrl}auth/me`, {headers: headers});
    }

    // upvote an answer
    upvote(token: string, question_id: string, answer_id: string) {
        const headers = {'Content-Type': 'application/json','Authorization': 'Bearer ' + token};
        return this.http.post(this.baseUrl + `questions/${question_id}/answers/${answer_id}/upvote`,{}, {headers: headers});
    }

    // approve an answer
    approve(token: string, question_id: string, answer_id: string) {
        const headers = {'Content-Type': 'application/json','Authorization': 'Bearer ' + token};
        return this.http.post(this.baseUrl + `questions/${question_id}/answers/${answer_id}/approve`, {}, {headers:headers});
    }

    // post a question
    postQuestion(data: {
        "title": string,
        "description": string
    }) {
        return this.http.post(this.baseUrl + "questions", data);
    }

    // post an Answer to a question
    postAnswer(token: string, ans_id: string, data: {
        "answer": string,
    }) {
        const headers = {'Content-Type': 'application/json','Authorization': 'Bearer ' + token};
        return this.http.post(this.baseUrl + "questions/"+ans_id+"/answers", data, {headers: headers});
    }

    // get a question from id
    getQuestion(id: string) {
        return this.http.get(`${this.baseUrl}questions/${id}`);
    }

    // get all comments of an answer
    getComments(token: string, question_id:string, ans_id: string) {
        const headers = {'Content-Type': 'application/json','Authorization': 'Bearer ' + token};
        return this.http.get(`${this.baseUrl}questions/${question_id}/answers/${ans_id}/comments`, {headers: headers});
    }
}