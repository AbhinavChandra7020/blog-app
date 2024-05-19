import { SignupInput } from "@abhinavchandra7020/blog-app-project-common1"
import { ChangeEvent, useState,} from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";
import { BACKEND_URL } from "../config";


export const Auth = ({type}: {type: "signup" | "signin"}) =>{
    
    const [postInputs, setPostInputs] = useState<SignupInput>({
        email: "",
        password: "",
        name: ""
    })

    const navigate = useNavigate()

    async function sendRequest() {
        try{
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, postInputs);
            const jwt = response.data;
            localStorage.setItem("token", jwt.jwt);
            navigate("/blogs")
        } catch (e) {
            alert("Error while signing up")
        }
    }
    
    return <div className = "h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <div>
                <div className="px-10">
                    <div className="text-4xl font-extrabold">
                        Create an account
                    </div>
                    <div className = "text-slate-400 font-medium pl-4 pb-8">
                        {type === "signin" ? "Don't have an account?" : "Already have an account?"}
                        <Link className = "pl-1 underline" to = {type === "signup" ? "/signin" : "/signup"}>
                            {type === "signin" ? "Sign up" : "Sign in"}
                        </Link>
                    </div>
                </div>
                <div>
                <div className = "pb-4">
                        {type === "signup" ? <LabelledInput label = "Name" placeholder = "John Doe" onChange={(e) =>{
                            setPostInputs(c =>({
                                ...postInputs,
                                name: e.target.value
                            }))
                        }} /> : null}
                    </div>
                    <div className = "pb-4">
                        <LabelledInput label = "Username" placeholder = "example@gmail.com" onChange={(e) =>{
                            setPostInputs(c =>({
                                ...postInputs,
                                email: e.target.value
                            }))
                        }} />
                    </div>
                    <div className = "pb-4">
                        <LabelledInput label = "Password" type = {"password"} placeholder = "qwerty123" onChange={(e) =>{
                            setPostInputs(c =>({
                                ...postInputs,
                                password: e.target.value
                            }))
                        }} />
                    </div>
                    <button onClick = {sendRequest} type="button" className=" w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "signup" ? "Sign Up" : "Sign in"}</button>
                </div>
            </div>
        </div>
    </div>
}
interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string
}
function LabelledInput({label, placeholder, onChange, type}: LabelledInputType){
    return <div>
        <div>
            <label className = "block mb-2 text-sm font-bold text-black">{label}</label>
            <input onChange = {onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
        </div>
    </div>
}