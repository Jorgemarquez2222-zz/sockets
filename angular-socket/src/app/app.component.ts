import { Component } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operator/map';
import 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  socket = null;
  chatinp='';
  roomnme='';
  user = '';
  misMensajes=[];
  listaContactosConectados: any = [];
  parejaChat:any = {user:String, userId:String};
  title = 'app works!';

  constructor(){

    this.parejaChat={
      user:'',
      userId:''
    }

    this.socket = io('http://localhost:3000');

    this.listaContactos().subscribe(
      res => {
        this.listaContactosConectados = res;
        console.log(this.listaContactosConectados );
      }
    )
    
    this.mensajes().subscribe(
      res => {
        let mensajeString = JSON.stringify(res)
        let data = JSON.parse(mensajeString )
        if( data.parejaChat == this.socket.id ){
          this.misMensajes.push(data);
        } else{
          console.log('no encontro igualdad')
        }
      }
    )
  }

  send(msg,parejaChat,remitente){
    this.socket.emit('conversacion', { msg:msg,parejaChat:parejaChat,remitente:remitente } )
  }

  // joinroom(roomnme){
  //   let listener = Observable.fromEvent(this.socket, this.roomnme);
  //   alert('Connet to ' + this.roomnme)
  //   listener.subscribe(
  //     (payload)=>{
  //       console.log('From room'+ this.roomnme+ '-' +payload)
  //     }
  //   )
  // }

  crearUser(user){
    this.user = user;
    this.socket.emit('user_connect', {user:this.user, userId: this.socket.id} );
  }


  listaContactos(){
      let data = new Observable(observer => {
       this.socket.on('lista_contactos', (data) => {
         observer.next(data);    
      });
    
    })
    return data;
  }

  mensajes(){
      let data = new Observable(observer => {
       this.socket.on('conversacion', (data) => {
         observer.next(data);    
      });
    
    })
    return data;
  }

  obtenerParejaChat(parejaChat){
    this.parejaChat = parejaChat;
  }

}
