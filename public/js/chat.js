const socket = io()

const $messageForm=document.querySelector('#message-form')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFromButton=$messageForm.querySelector('button')
const $messages=document.querySelector('#messages')
const $sidebar=document.querySelector('#sidebar')
const messsageTemplete=document.querySelector('#message-template').innerHTML//render templete
const urlTemplete=document.querySelector("#url-template").innerHTML
const sidebarTemplate=document.querySelector('#sidebar-templete').innerHTML

const{ username , room  }=Qs.parse(location.search,{ignoreQueryPrefix:true})
const autoScroll=()=>{
    //new message element
    const $newMessage=$messages.lastElementChild
    //Height of new message
    const newMessageStyles=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight+newMessageMargin
    //console.log(newMessageMargin)
    //
    const visibleHeight=$messages.offsetHeight
    //Height of message container
    const containerHeight=$messages.scrollHeight

    //how far have i scrolled
    const scrollOffset=$messages.scrollTop + visibleHeight//from top how scroll

   if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop=$messages.scrollHeight
        
    }

}
socket.on('message',(message)=>{
    console.log(message)
    const html=Mustache.render(messsageTemplete,{
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a'),
        username:message.username
        
    })
    $messages.insertAdjacentHTML('beforeend',html)//+++
    autoScroll()

})
socket.on('LocationMessage',(URL)=>{
   // console.log(url)
    const html=Mustache.render(urlTemplete,{
    url:URL.url,
    createdAt:moment(URL.createdAt).format('h:mm a'),
    username:URL.username
    })
    $messages.insertAdjacentHTML('beforeend',html)//+++
    autoScroll()
})
socket.on('roomData',({room,users})=>{
    console.log(room)
    console.log(users)
    const html=Mustache.render(sidebarTemplate,{
       room,
        users
        })
        $sidebar.innerHTML=html//+++
})
$messageForm.addEventListener('submit',(e)=>{
e.preventDefault()
$messageFromButton.setAttribute('disabled','disabled')
const message=e.target.message.value
socket.emit('sendMessage', message,(error)=>{
    $messageFromButton.removeAttribute('disabled')
    //console.log('The message was diliverd',message)
    if (error) {
        return console.log(error)
    }
    console.log('Message Dilivered')
})
})

document.querySelector('#send-location').addEventListener('click',()=>{
   
  if (!navigator.geolocation) {
      return alert('Geolocation is not supported by your browser')
  } $messageFormInput.setAttribute('disabled','disabled')
  navigator.geolocation.getCurrentPosition((position)=>{
    //console.log(position.coords)
    const{longitude,latitude}=position.coords
    socket.emit('sendLocation',{longitude,latitude},()=>{
        $messageFormInput.removeAttribute('disabled')
        //console.log('location shared')
    })
  })  
})

socket.emit('join',{username,room},(error)=>{
if(error){
    alert(error)
    location.href='/'
}
})
