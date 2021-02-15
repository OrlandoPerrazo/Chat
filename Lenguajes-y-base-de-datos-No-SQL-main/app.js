const botones = document.querySelector('#botones')
const nombreUsuario = document.querySelector('#nombreUsuario')
const contenidoProtegido = document.querySelector('#contenidoProtegido')
const formulario = document.querySelector('#formulario')
const inputchat = document.querySelector('#inputchat')

firebase.auth().onAuthStateChanged(user=>{
    if(user){
        console.log(user)
        botones.innerHTML = /*html*/ `
        <button class="btn btn-outline-danger" id='btnCerrarSesion'>Cerrar sesion</button>
        `
        nombreUsuario.innerHTML = user.displayName
        formulario.classList = 'input-group py-3 fixed-bottom container'
        contenidoChat(user)
        cerrarSesion()
    }else{
        console.log("no existe usuario")
        botones.innerHTML = /*html*/ `
        <button class="btn btn-outline-success" id='btnAcceder'>Acceder</button>
        `
        iniciarSesion()
        nombreUsuario.innerHTML = 'chat'
        contenidoProtegido.innerHTML =/*html*/`
        <p class="text-center lead mt-5"> Debes inciar sesion</p>
        `

        formulario.classList = 'input-group py-3 fixed-bottom container d-none'
    }
})

const contenidoChat = (user) => {
    
        formulario.addEventListener('submit', (e) =>{
            e.preventDefault()
            console.log(inputchat.value)

            if(!inputchat.value.trim()){
                console.log('input vacio')
                return
            }

            firebase.firestore().collection('chat').add({
                texto: inputchat.value,
                uid: user.uid,
                fecha: Date.now()

            })
                .then( res => {console.log('mensaje guardado')})
                .catch(e => console.log(e))
            inputchat.value = ''
        })


        firebase.firestore().collection('chat').orderBy('fecha')
        .onSnapshot(query => {
            //console.log(query)
            contenidoProtegido.innerHTML = ''
            query.forEach(doc => {
                console.log(doc.data())
                if (doc.data().uid == user.uid){
                    contenidoProtegido.innerHTML +=`
                        <div class="d-flex justify-content-end">
                            <span class="badge rounded-pill bg-primary">${doc.data().texto}</span>
                        </div>
                        `
                }else{
                    contenidoProtegido.innerHTML += `
                        <div class="d-flex justify-content-start">
                            <span class="badge rounded-pill bg-primary">${doc.data().texto}</span>
                        </div>
                        `
                }
                contenidoProtegido.scrollTop = contenidoProtegido.scrollHeight
            })

        })
}

const cerrarSesion = () => {
    const btnCerrarSesion = document.querySelector('#btnCerrarSesion')
    btnCerrarSesion.addEventListener('click', () => {
        firebase.auth().signOut()
    })
}

const iniciarSesion = () => {
    const btnAcceder = document.querySelector('#btnAcceder')
    btnAcceder.addEventListener('click', async() => {
        console.log('me diste click en acceder')
        try {
            const provider = new firebase.auth.GoogleAuthProvider()
            await firebase.auth().signInWithPopup(provider)
        } catch (error) {
            console.log(error)
        }
    })
}