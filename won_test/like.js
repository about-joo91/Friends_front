const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5502"

let liked = false
const urlParams = new URLSearchParams(window.location.pathname);
// const post_id = urlParams.get('id'); //?
const post_id = 1


async function postLike(post_id){
    const response = await fetch(`${backend_base_url}/won_test/like/${post_id}`,{
        headers:{
            'Authorization' : 'Bearer '+ localStorage.getItem("access")},
        method:'POST',
    })

    if (response.status ==200){
        response_json = await response.json()
        return response_json
    }else{
        alert(response.status)
    }
}

async function like(){
    const like_button = document.getElementById("like_button")
    if (like_button.classList.contains('fa-solid')){
        like_button.classList.replace('fa-solid', 'fa-regular')
    }else{
        like_button.classList.replace('fa-regular', 'fa-solid')
    }
    const response = await postLike(post_id)
    console.log(response, "좋아요")
}
