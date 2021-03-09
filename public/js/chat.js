const socket = io()
//var bcrypt = bcryptjs();
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
    //decrypt message with 8
    const html=Mustache.render(messsageTemplete,{
        message:caear_cipher_dencrypt( message.text,8),
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
let message=e.target.message.value
message=caear_cipher_encrypt(message,5)
//var hash = bcrypt.hashSync(message, 8);
//console.log(hash)
//encrpyt data with 5
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


const englishChar = () => "abcdefghijklmnopqrstuvwxyz";
const caear_cipher_encrypt = (message, numofpos = 0) => {
  const max = 26;
  const low = englishChar();
  const upper = englishChar().toLocaleUpperCase();
  let encryptedMessage = "";
  for (let index = 0; index < message.length; index++) {
    let checkwherecharlow = low.indexOf(message[index]);
    let checkwherecharupper = upper.indexOf(message[index]);
    encryptedMessage +=
      checkwherecharlow > -1
        ? low[(checkwherecharlow + numofpos) % max]
        : checkwherecharupper > -1
        ? upper[(checkwherecharupper + numofpos) % max]
        : message[index];
  }
  return encryptedMessage;
};
const caear_cipher_dencrypt = (message, numofpos = 0) => {
  const max = 26;
  const low = englishChar();
  const upper = englishChar().toLocaleUpperCase();
  let decryptMessage = "";
  for (let index = 0; index < message.length; index++) {
    let checkwherecharlow = low.indexOf(message[index]);
    let checkwherecharupper = upper.indexOf(message[index]);
    decryptMessage +=
      checkwherecharlow > -1
        ? low[(checkwherecharlow - numofpos + max) % max]
        : checkwherecharupper > -1
        ? upper[(checkwherecharupper - numofpos + max) % max]
        : message[index];
  }
  return decryptMessage;
};
const brute_force_attack = (message) => {
  const max = 26;
  let arrayOfResult = [];
  for (let index = 0; index < max; index++) {
    let decryptMessage = caear_cipher_dencrypt(message, index);
    arrayOfResult.push(decryptMessage);
  }
  return arrayOfResult;
};


