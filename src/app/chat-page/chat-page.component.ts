import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import * as io from 'socket.io-client';
import * as jQuery from 'jquery';
import { Socket } from 'ngx-socket-io';
import { ToastrService } from 'ngx-toastr';
import { ChatServiceService } from 'src/app/service/chat-service.service';
import { UserService } from 'src/app/service/user.service';
declare var $: any;
//let $ = require('../../../../node_modules/jquery/dist/jquery.min.js');ssssssssssgsgsghhdddhhhdddhhdddhhddddjjjjjjjrrrrrrrsgssssssssssssssssssss   ggsssgffgff  fdfdfdfdfdhdfdfhdhdhdhdhd

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit {

  userId = sessionStorage.getItem('user_id') ? sessionStorage.getItem('user_id') : localStorage.getItem('user_id');
  routeId: any;
  userData = sessionStorage.getItem('userNumber') ? sessionStorage.getItem('userNumber') : localStorage.getItem('userNumber');
  userType = sessionStorage.getItem('userType');
  message?: string;
  AllUser: any;
  User: any;
  searchUserForGuest: any;
  data: any;
  users: any;
  room: any;
  selectedUserGroup: any = [];
  userName: any;
  searchUser: any;
  searchToAddGroup: any
  file: any;
  groupImage: any;
  isUpload: boolean = false;
  groupNames: any;
  roomUser: boolean = false;
  groupId: any = '';
  senderUserId: any = '';
  userMessage: any;
  groupMessage: any = [];
  constructor(private router: Router, private toastr: ToastrService,
    private chatService: ChatServiceService, private socket: Socket,
    private userService: UserService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.routeId = '';
    this.userId = localStorage.getItem('user_id');
    // jQuery("#searchForGuest").focusin(function(){
    //   jQuery("#ModalForGuest").show(); 
    // });
    // jQuery("#closeForGuest").click(function() {
    //   jQuery('#ModalForGuest').hide();
    // })
    // $("#searchForGuest").focusin(function(){
    //   $("#ModalForGuest").show();
    //   $(".search-modal").css("display", "block");
    //   // $('#ModalForGuest').hide();
    // });

    // $("#closeForGuest").click(function() {
    //   $('#ModalForGuest').hide()
    // })
    jQuery("#search").focusin(function () {
      jQuery("#Modal").show();
    });

    jQuery("#close").click(function () {
      jQuery('#Modal').hide();
    })
    this.routeId = this.route.snapshot.paramMap.get('id');
    this.getUsers();
    // console.log('this.AllUser',this.AllUser)
    this.getAllGroups();
    this.setupSocketConnection();
    this.checkOnline();



    if (this.routeId) {
      setTimeout(() => {
        this.OpenChatBox(this.routeId)
        console.log(this.User)
      }, 1000);
    }

    $('.chat-friend-toggle').on('click', function () {
      $('.chat-frind-content').toggle();
    });
  }

  ngAfterViewInit() {
    jQuery("#search").focusin(function () {
      jQuery("#Modal").show();
    });

    jQuery("#close").click(function () {
      jQuery('#Modal').hide();
    })
  }
  // selectFile(event: any) {

  //   if (event.target.files) {
  //     var reader = new FileReader();
  //     reader.readAsDataURL(event.target.files[0]);
  //     reader.onload = (event: any) => {
  //       this.file = event.target.result;
  //     }
  //   }
  //   console.log("Image Upload :", this.file)
  // }





  selectFile(event: any) {

    if (event.target.files && event.target.files.length > 0) {
      let files = event.target.files[0].name
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.file = event.target.result;
        let data = {
          username: this.User.userName,
          groupId: '',
          user_id: this.userId,
          sender_id: this.userId,
          receiver_id: this.User._id,
          message: files,
          file: this.file,
          created_at: this.User.created_at,
        };

        this.socket.emit('newMessage', data);
        this.message = '';
        this.file = '';
        const currentTime = new Date().toLocaleTimeString()
        this.socket.on('message', (data: any) => {
          this.data = data;
          console.log("Data From Server", data);
          let className = 'replies';

          if (data.sender_id == data.user_id) {
            className = 'replies'
            let htmlData = `  
            <li class="${className}">
            <div class="media">
              <div class="profile mr-4"><img class="bg-img" src="assets/img/chat1.jpg" style="border-radius: 50%;" alt="Avatar"/></div>
              <div class="media-body">
                <div class="contact-name">
                  <h5> ${data.username} </h5>
                  <h6> ${currentTime} </h6>
                  <ul class="msg-box">
                    <li class="msg-setting-main">
                      <h5> ${data.message} </h5>
                    </li>
                    ${data.file ? '<li class="msg-setting-main" style="height: 200px;"><img  src= ' + data.file + ' height="200" onerror="this.onerror=null;this.src=`assets/img/avatar.jpg`"></li>' : ''}
                  </ul>
                </div>
              </div>
            </div>
          </li>`
            $('#message-list').append(htmlData);
            $("#message-list").reset();
          }
          else {
            let htmlData = `  
            <li class="${className}">
            <div class="media">
              <div class="profile mr-4"><img class="bg-img" src="assets/img/chat1.jpg" style="border-radius: 50%;" alt="Avatar"/></div>
              <div class="media-body">
                <div class="contact-name">
                  <h5> ${data.username} </h5>
                  <h6>${currentTime}</h6>
                  <ul class="msg-box">
                    <li class="msg-setting-main">
                      <h5>${data.message}</h5>
                    </li>
                    ${data.file ? '<li class="msg-setting-main" style="height: 200px;"><img  src= ${data.file} height="200" onerror="this.onerror=null;this.src=`assets/img/avatar.jpg`"></li>' : ''}
                  </ul>
                </div>
              </div>
            </div>
          </li>`
            $('#message-list').append(htmlData);
            $("#message-list").reset();
          }
        })
      }
    }
    console.log("Image Upload :", this.file)
  }

  // $(document).ready(function() {  
  // $('#message-list').append(htmlData);
  //});  


  selectProfileImage(event: any) {

    if (event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.groupImage = event.target.result;
      }
    }
    console.log("Room Image Upload :", this.groupImage)
  }


  sendMessage(message: any) {
    let data = {
      username: this.userData,
      groupId: '',
      user_id: this.userId,
      sender_id: this.userId,
      receiver_id: this.User._id,
      message: message,
      file: this.file,
      created_at: this.User.created_at,
    };

    this.socket.emit('newMessage', data);
    this.message = '';
    this.file = '';
    const currentTime = new Date().toLocaleTimeString()
    this.socket.on('message', (data: any) => {
      this.data = data;
      console.log('userData', this.userData)
      console.log("Data From Server for user", data);
      let className = 'sent';
      // if (data.sender_id == data.user_id) {
      if (this.userData == data.username) {
        className = 'replies'
        let htmlData = `  
        <li class="replies">
        <div class="media">
          <div class="profile mr-4"><img class="bg-img" src="assets/img/chat1.jpg" style="border-radius: 50%;" alt="Avatar"/></div>
          <div class="media-body">
            <div class="contact-name">
              <h5> ${data.username} </h5>
              <h6> ${currentTime} </h6>
              <ul class="msg-box">
                <li class="msg-setting-main">
                  <h5> ${data.message} </h5>
                </li>
                ${data.file ? '<li class="msg-setting-main" style="height: 200px;"><img  src= ' + data.file + ' height="200" onerror="this.onerror=null;this.src=`assets/img/avatar.jpg`"></li>' : ''}
              </ul>
            </div>
          </div>
        </div>
      </li>`
        $('#message-list').append(htmlData);
        $("#message-list").reset();
      }
      else {
        className = 'sent'
        let htmlData = `  
        <li class="sent">
        <div class="media">
          <div class="profile mr-4"><img class="bg-img" src="assets/img/chat1.jpg" style="border-radius: 50%;" alt="Avatar"/></div>
          <div class="media-body">
            <div class="contact-name">
              <h5> ${data.username} </h5>
              <h6>${currentTime}</h6>
              <ul class="msg-box">
                <li class="msg-setting-main">
                  <h5>${data.message}</h5>
                </li>
                ${data.file ? '<li class="msg-setting-main" style="height: 200px;"><img  src= ${data.file} height="200" onerror="this.onerror=null;this.src=`assets/img/avatar.jpg`"></li>' : ''}
              </ul>
            </div>
          </div>
        </div>
      </li>`
        $('#message-list').append(htmlData);
        $("#message-list").reset();
      }
    })
  }


  selectGroupFile(event: any) {

    if (event.target.files && event.target.files.length > 0) {
      let files = event.target.files[0].name
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.file = event.target.result;

        let data = {
          // username: this.User.userName,
          groupId: this.groupId,
          user_id: this.userId,
          sender_id: this.userId,
          // receiver_id: this.User._id,
          message: files,
          file: this.file,
          // created_at: this.User.created_at,
        };


        this.socket.emit('newRoomMessage', data);
        this.message = '';
        this.file = '';
        const currentTime = new Date().toLocaleTimeString()
        this.socket.on('message', (data: any) => {

          this.data = data;
          console.log("Data From Server", data);


          let className = 'replies';
          if (data.sender_id == data.senderId._id) {

            className = 'replies'
            let htmlData = `  
             <li class="${className}">
             <div class="media">
               <div class="profile mr-4"><img class="bg-img" src="assets/img/chat1.jpg" style="border-radius: 50%;" alt="Avatar"/></div>
               <div class="media-body">
                 <div class="contact-name">
                 <h5> ${data.senderId.userName} </h5>
                   <h6> ${currentTime} </h6>
                   <ul class="msg-box">
                     
                     <li class="msg-setting-main">
                     ${data.file ? `<img  src= ${data.file} style height="200" onerror="this.onerror=null;this.src='assets/img/avatar.jpg'"> ` : ''} 
                   </li>                  
                   </ul>
                 </div>
               </div>
             </div>
           </li>`
            $('#message-list-group').append(htmlData);
            $("#message-list-group").reset();
          }
          else {
            let htmlData = `  
             <li class="${className}">
             <div class="media">
               <div class="profile mr-4"><img class="bg-img" src="assets/img/chat1.jpg" style="border-radius: 50%;" alt="Avatar"/></div>
               <div class="media-body">
                 <div class="contact-name">
                 <h5> ${data.senderId.userName} </h5>
                   <h6>${currentTime}</h6>
                   <ul class="msg-box">
                     
                     <li class="msg-setting-main">
                     ${data.file ? `<img  src= ${data.file} style height="200" onerror="this.onerror=null;this.src='assets/img/avatar.jpg'"> ` : ''} 
                   </li>                
                     </ul>
                 </div>
               </div>
             </div>
           </li>`
            $('#message-list-group').append(htmlData);
            $("#message-list-group").reset();

          }

        })

      }


    }
    console.log("Image Upload :", this.file)
  }


  sendRoomMessage(message: any) {
    console.log('function call')
    let data = {
      username: this.userData,
      groupId: this.groupId,
      user_id: this.userId,
      sender_id: this.userId,
      //receiver_id: this.User._id,
      message: message,
      file: this.file,
      //                                                                      
      created_at: this.User.created_at,
    };

    this.socket.emit('newMessage', data);
    this.message = '';
    this.file = '';
    const currentTime = new Date().toLocaleTimeString()
    this.socket.on('message', (data: any) => {
      this.data = data;
      console.log("Room Data From Server for group", data);
      //console.log("User Data  From Server", data.senderId.userName);


      let className = 'replies';
      if (this.userId == data.senderId._id) {

        className = 'replies'
        let htmlData = `  
        <li class="replies">
        <div class="media">
          <div class="profile mr-4"><img class="bg-img" src="assets/img/chat1.jpg" style="border-radius: 50%;" alt="Avatar"/></div>
          <div class="media-body">
            <div class="contact-name">
              <h5> ${data.senderId.userName} </h5>
              <h6> ${currentTime} </h6>
              <ul class="msg-box">
                <li class="msg-setting-main">
                  <h5> ${data.message} </h5>
                </li>
                <li class="msg-setting-main">
                ${data.file ? `<img  src= ${data.file} style height="200" onerror="this.onerror=null;this.src='assets/img/avatar.jpg'"> ` : ''} 
              </li>                  
              </ul>
            </div>
          </div>
        </div>
      </li>`
        $('#message-list-group').append(htmlData);
        $("#message-list-group").reset();
      }
      else {
        let htmlData = `  
        <li class="sent">
        <div class="media">
          <div class="profile mr-4"><img class="bg-img" src="assets/img/chat1.jpg" style="border-radius: 50%;" alt="Avatar"/></div>
          <div class="media-body">
            <div class="contact-name">
            <h5> ${data.senderId.userName} </h5>
              <h6>${currentTime}</h6>
              <ul class="msg-box">
                <li class="msg-setting-main">
                  <h5>${data.message}</h5>
                </li>
                <li class="msg-setting-main">
                ${data.file ? `<img  src= ${data.file} style height="200" onerror="this.onerror=null;this.src='assets/img/avatar.jpg'"> ` : ''} 
              </li>                
                </ul>
            </div>
          </div>
        </div>
      </li>`
        $('#message-list-group').append(htmlData);
        $("#message-list-group").reset();
      }
    })
  }


  checkselected(user: any) {
    let index = this.selectedUserGroup.findIndex((x: any) => x._id == user._id);
    if (index > -1) {
      return true;
    } else {
      return false;
    }
  }
  removeSelectedUser(index: any) {
    this.selectedUserGroup.splice(index, 1);
  }
  addUserGroup(event: any, user: any) {
    if (event.target.checked) {
      this.selectedUserGroup.push(user)
    } else {
      let index = this.selectedUserGroup.findIndex((x: any) => x._id == user._id);
      if (index > -1) {
        this.selectedUserGroup.splice(index, 1)
      }
    }
  }

  setupSocketConnection() {
    this.socket.emit('online', this.userId, (data: any) => {
      console.log(data);
    });
  }


  checkOnline() {
    this.socket.emit('user_connection', this.userId, (onlineUser: number) => {
      console.log('onile User', onlineUser);
      // this.socket.emit('online', this.userId, (res:any)=>{
      //   console.log('res', res)
      // });
    });
  }

  joinGroup(room: any, selectedUserGroup: any[]) {
    let data = {
      username: this.userName,
      groupId: '',
      user_id: this.userId,
      sender_id: this.userId,
      // receiver_id: this.User._id,
      room: room,
      selectedUserGroup: selectedUserGroup,
      groupImage: this.groupImage
    };


    let userGroupDate = {
      'type': 0,
      'memberId': selectedUserGroup,
      'lastMessage': '',
      'lastTime': '',
      'groupName': room,
      'groupTitle': '',
      'groupImg': this.groupImage
    }
    //uploade image has been created by someone sir
    // this.chatService.createChatGroup(userGroupDate).subscribe(res => {
    //   if (res) {
    //     console.log(res);
    //     this.getAllGroups();
    //   }
    // })
    //   if(this.userId){}
    this.socket.emit('joinRoomGroup', data);
    console.log("Requesting for group join : ", data);

    this.socket.on('roomUsers', (dataFromServer: any) => {
      // this.data = dataFromServer;
      this.toastr.success(dataFromServer, "Success")
      console.log("Created group data : ", dataFromServer);

      let className = 'replies';
      // if (this.userId) {
      //   className = 'sent'
      // }
      let htmlData = `  
            <li class="`+ className + `">
            <div class="media">
              <div class="media-body">
                <div class="contact-name">
                  <h5>`+ dataFromServer + `</h5>
                </div>
              </div>
            </div>
          </li>`
      $('#message-list').append(htmlData);
      $("#message-list").reset();
    })
    // roomUsers
    // console.log({username: this.User.userName, groupId:'', user_id:this.userId, sender_id:this.userId, receiver_id:this.User._id})
    // this.socket.emit('joinRoomGroup', (data: any) => {
    //   data.join({ username: this.User.userName, groupId: '', user_id: this.userId, sender_id: this.userId, receiver_id: this.User._id });
    //   console.log(data);
    //   this.socket.emit('roomUsers', (res: any) => {
    //     console.log('res', res)
    //   });
    // })
    this.getAllGroups();
  }

  leaveGroup() {
    let data = {
      // username: this.User.username,
      groupId: '',
      user_id: this.userId,
      sender_id: this.userId,
      // receiver_id: this.User._id,
      room: this.room,
      //id:id
    };

    // if(this.userId){}
    this.socket.emit('leaveGroup', data);
    console.log("Requesting for leave : ", data);

    this.socket.on('left group', (data: any) => {
      this.data = data;
      console.log("Left group data : ", this.data);
      let className = 'replies';
      // if (this.userId) {
      //   className = 'sent'
      // }
      let htmlData = `  
            <li class="`+ className + `">
            <div class="media">
              <div class="media-body">
                <div class="contact-name text-center">
                  <h5>`+ this.data`</h5>
                </div>
              </div>
            </div>
          </li>`
      $('#message-list').append(htmlData);
    })
    this.getAllGroups();
  }

  getUsers() {
    this.userService.getallUsers().subscribe(Response => {
      this.AllUser = Response.data;
      console.log('this.AllUser2', this.AllUser)
    })
  }

  getAllGroups() {
    this.chatService.getAllGroup().subscribe(res => {
      this.groupNames = res.data;
      console.log(res);
    })
  }


  OpenChatBox(id: any) {
    this.groupId = '';
    this.senderUserId = id;
    this.User = !this.roomUser;
    this.User = this.AllUser.find((userData: any) => userData._id == id);
    let data = {
      'senderId': this.userId,
      'receiverId': id
    }
    this.chatService.getUserMessages(data).subscribe(Response => {
      this.userMessage = Response.data;
    })
  }

  OpenChatRoomBox(id: any) {
    this.groupMessage = '';
    this.groupId = id;
    this.senderUserId = '';
    this.roomUser = true;
    this.User = !this.roomUser;

    this.room = this.groupNames.find((roomData: any) => roomData._id == id);
    let data = {
      'groupId': id
    }
    this.chatService.getGroupMessages(data).subscribe(Response => {
      this.groupMessage = Response.data;
      console.log(Response)
    })
  }

  OpenUserChatRoomBox(id: any) {
    let data = {
      'senderId': this.userId,
      'receiverId': id
    }
    this.chatService.getUserMessages(data).subscribe(Response => {
      this.userMessage = Response.data;
    })
  }

  getUserByAId(id: any) {
    this.User = this.AllUser.find((userData: any) => userData._id == id);
    console.log(this.User.userName)
    // return this.User.userName;
  }
  logout() {
    this.router.navigate(['/'])
      .then(() => {
        localStorage.clear();
      });
  }

  sendEmailToInvite(email: any) {
    if (email == null || email == '') {
      this.toastr.error('Please Enter Email', 'Error')
      return false
    }
    if (email.match("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")) {
      let data = {
        email: email,
        userName: this.userData
      }
      this.chatService.sendEmail(data).subscribe(Response => {
        console.log(Response)
        this.toastr.success(`Mail has been sent to the ${email}`, 'Success')
      })
    } else {
      this.toastr.error('Please Enter valid Email', 'Error')
      return false
    }

  }

  ngOnDestroy() {
    this.socket.emit('disconnect', this.userId);
    this.socket.emit('offline', this.userId);
  }
}
