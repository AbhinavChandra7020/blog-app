
interface BlogCardProps {
    title: string;
    content: string;
    authorName: string;
    publishedDate: string;
}


export const BlogCard = ({title, content, authorName, publishedDate}: BlogCardProps) =>{
    return <div>
        <div className = "flex">
            <div className = "flex justify-center flex-col">
                <Avatar name = {authorName} />
            </div>
            <div className="font-extralight pl-1">
                {authorName}
            </div>
            <div className = "pl-1">
                &#128900;
            </div>
            <div className="pl-2 font-thin text-slate-500">
                {publishedDate}
            </div>
        </div>
        <div>
            {title}
        </div>
        <div>
            {content.slice(0, 100) + "..."}
        </div>
        <div>
            {`${Math.ceil(content.length / 100)} mins`}
        </div>
        <div className = "bg-gray-200 h-0.5">
            
        </div>
    </div>
}

function Avatar({name} : {name:string}){
    return <div className="relative inline-flex items-center justify-center w-5 h-5 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
        <span className="text-xs font-extralight text-gray-600 dark:text-gray-300">
            {name[0]}
        </span>
    </div>
    
}