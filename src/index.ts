import axios from 'axios'
type Api_t = {
    user: {
        postText: {
            req: {
                id:string;
                post:string;
            }
            res: {
                status: number;
            }
        }
        getPost: {
            req: {
                id: string;
                from: string;
                to: string;
            }
            res: {
                status: number
                postData: string[];
            }
        }
    },
    admin: {
        getStatus: {
            req: {
                id:string;
            }
            res: {
                status: number;
                info: {
                accessLevel: "full" | "limited";
                permissions: string[];
                };
            }
        }
        deleteUser: {
            req: {
                id:string;
            }
            res: {
                status:number;
            }
        }
    }
}

type ExtractReq<T> = T extends { req: infer R } ? R : never;
type ExtractRes<T> = T extends { res: infer R } ? R : never;

function callApi(baseURL:string) {
    return function <T extends keyof Api_t>(path: T) {
        return function (method: "post" | "get") {
            return function <K extends Extract<keyof Api_t[T], string>>(endpoint: K) {
                return function (req: ExtractReq<Api_t[T][K]>) {
                    if(method === "post") {
                        return axios.post<ExtractRes<Api_t[T][K]>>(baseURL + path + endpoint, req)
                    }
                    return axios.get<ExtractRes<Api_t[T][K]>>(baseURL + path + endpoint, {params: req})
                }
            }
        }
    }
}

callApi("http://localhost:3000")("admin")("post")("deleteUser")({id: "123"})
.then(res => {
    console.log(res.data.status)
})