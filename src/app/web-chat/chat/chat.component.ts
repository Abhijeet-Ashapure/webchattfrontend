import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import * as io from 'socket.io-client';
import { Socket } from 'ngx-socket-io';
import { ToastrService } from 'ngx-toastr';
import { ChatServiceService } from 'src/app/service/chat-service.service';
import { UserService } from 'src/app/service/user.service';
import * as jQuery from 'jquery';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { error } from 'jquery';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from 'src/app/theme/theme.service';

declare var $: any;

const SOCKET_ENDPOINT = 'http://18.191.97.1:4000'
// const SOCKET_ENDPOINT = 'http://localhost:4000'
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  loader: boolean = false;
  userId = sessionStorage.getItem('user_id') ? sessionStorage.getItem('user_id') : localStorage.getItem('user_id');
  isUsaerOnline: boolean = false;
  routeId: any;
  routeName: any;
  guestUserEmail: any;
  showInvite: boolean = false;
  invitationLink: any;
  shareGroupLink: any;
  shareGroupId: any;
  userRouteMsg: any;

  userData = sessionStorage.getItem('userNumber') ? sessionStorage.getItem('userNumber') : localStorage.getItem('userNumber');
  userType = sessionStorage.getItem('userType');
  userEmail = localStorage.getItem('userName') ? localStorage.getItem('userName') : sessionStorage.getItem('email');
  message?: string;
  AllUser: any;
  allUserWithChatHistory: any = [];
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
  groupFile: any;
  groupImage: any;
  isUpload: boolean = false;
  groupNames: any;
  roomUser: boolean = false;
  groupId: any = '';
  senderUserId: any = '';
  userMessage: any = [];
  groupMessage: any = [];
  inviteEmail: any;
  inviteUser: boolean = false;
  guestLoginForm: FormGroup;
  messageRead: boolean = false;
  isChatToggle: boolean = false;
  showGuestUserList: any = [];
  onlineUserList: any = [];
  constructor(private router: Router, private toastr: ToastrService,
    private chatService: ChatServiceService, private socket: Socket,
    private userService: UserService, private route: ActivatedRoute,
    private themeService: ThemeService,
    public translate: TranslateService,
    private fb: FormBuilder) {
    this.guestLoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      userName: ['', Validators.required],
    })
  }


  ngOnInit() {
    this.routeId = '';
    if (!this.userId && this.userId == null) {
      localStorage.setItem('afterLogin', location.href);
      this.router.navigate(['/guest-user']);
      return false;
    }
    this.makeOnlineUser(this.userId);
    this.invitationLink = location.origin + '/#/Web-Chat/Chat/' + this.userId;
    this.shareGroupLink = location.origin + '/#/Web-Chat/GroupChat/';
    this.route.paramMap.subscribe(params => {
      this.routeId = params.get("id");
      this.shareGroupId = params.get('groupId');
      this.guestUserEmail = params.get("guestEmail");
      this.inviteEmail = params.get('inviteEmail');
      this.userRouteMsg = params.get('userMessage');
      this.routeName = params.get('Username');
      if (this.shareGroupId) {
        this.editGroup(this.shareGroupId, this.userId)
      }
    })
    // this.routeId = this.route.snapshot.paramMap.get('id');
    this.socket.emit('onlineUserList');
    this.socket.on('onlineUserList', (onlineUserList: any) => {
      this.onlineUserList = onlineUserList.onlineUserList;
      this.getUserWithChatHistory();
    });
    this.getUsers();
    // this.getUserWithChatHistory();
    this.getAllGroups();
    this.setupSocketConnection();
    this.messageReadSocke('');

    this.socket.on(`firstMessage?id==${this.userId}`, (data: any) => {
      console.log(`firstMessage?id==${this.userId}`)
      this.getUserWithChatHistory();
      this.getUsers();
      this.toastr.success(`New user- ${data.username} Come, Said-: ${data.message}`, 'success');
    })

    if (this.shareGroupId) {
      this.loader = true;
      setTimeout(() => {
        this.OpenChatRoomBox(this.shareGroupId)
        this.loader = false;
      }, 3000)

    }

    if (this.routeId) {
      setTimeout(() => {
        this.OpenChatBox(this.routeId);
        this.checkOnline(this.routeId);
        console.log(this.User)
      }, 1000);
    }
    if (this.routeName) {
      this.loader = true;
      setTimeout(() => {
        this.userId = sessionStorage.getItem('user_id') ? sessionStorage.getItem('user_id') : localStorage.getItem('user_id');
        this.userData = sessionStorage.getItem('userNumber') ? sessionStorage.getItem('userNumber') : localStorage.getItem('userNumber');
        this.userType = sessionStorage.getItem('userType');
        if (this.userType != 'guest')
          this.OpenChatBox(this.routeId)
        this.loader = false;
      }, 1000);
    }

    if (this.guestUserEmail) {
      let data = {
        email: this.guestUserEmail,
        userName: this.guestUserEmail.split("@")[0]
      }
      this.guestLogin(data);
      setTimeout(() => {
        this.userId = sessionStorage.getItem('user_id') ? sessionStorage.getItem('user_id') : localStorage.getItem('user_id');
        this.userData = sessionStorage.getItem('userNumber') ? sessionStorage.getItem('userNumber') : localStorage.getItem('userNumber');
        this.userType = sessionStorage.getItem('userType');
        this.sendMessageByReceiver(this.userRouteMsg)
        this.router.navigate(['/Web-Chat/Chat', this.routeId])
      }, 1000);
    }



    this.socket.on('markRead', (data: any) => {
      this.getUserWithChatHistory();
    });
    if (this.inviteEmail) {
      this.inviteUser = true;
    }
    $('.chat-friend-toggle').on('click', function () {
      $('.chat-frind-content').toggle();
    });
  }

  makeOnlineUser(id: any) {
    this.socket.emit('user_connection', id);
    this.socket.on('online', (onlineUser: any) => {
      console.log('onlineUser', onlineUser)
    })
  }



  switchLang(lang: string) {
    this.translate.use(lang);
  }

  toggle() {
    const active = this.themeService.getActiveTheme();
    if (active.name === 'light') {
      this.themeService.setTheme('dark');
      $("#main").addClass("darkTheme");

    } else {
      this.themeService.setTheme('light');
      $("#main").removeClass("darkTheme");
    }
  }


  readMessage(messageId: any) {
    let data = {
      "_id": messageId
    }
    this.chatService.readMessage(data).subscribe(Response => {
      console.log(Response)
    })
  }

  messageReadSocke(message: any) {
    this.socket.emit('readMessage', message);
    if (message.receiverId == this.userId) {
      this.socket.on('markRead', (data: any) => {
        console.log(data)
      })
    }

  }



  guestUserLogin(data: any) {
    this.userService.userRegistration(data).subscribe(Response => {
      if (Response.success == true) {
        sessionStorage.setItem('user_id', Response.data[0]._id);
        sessionStorage.setItem('userNumber', Response.data[0].userName);
        sessionStorage.setItem('userType', Response.data[0].userType);
        this.toastr.success(Response.message, "Success")
        this.ngOnInit();
      } else {
        this.toastr.error(Response.message, "Error");
      }
    }, error => {
      this.toastr.error(error.error.message, 'Error');
    })
  }
  sendMessageByReceiver(message: any) {
    let receiverUser = this.AllUser.find((userData: any) => userData._id == this.routeId);
    let data = {
      username: receiverUser.userName,
      groupId: '',
      user_id: this.routeId,
      sender_id: this.routeId,
      receiver_id: this.userId,
      message: message,
      file: this.file,
      created_at: receiverUser.created_at,
    };

    this.socket.emit('newMessage', data);
    this.message = '';
    this.file = '';
    const currentTime = new Date().toLocaleTimeString()
    this.socket.on('message', (data: any) => {
      this.data = data;
      console.log('userData', this.userData)
      console.log("Data From Server for user", data);
      let datauser = {
        'senderId': this.routeId,
        'receiverId': this.userId
      }
      this.getUserWithChatHistory();
      this.chatService.getUserMessages(datauser).subscribe(Response => {
        this.userMessage = Response.data;
      })
    })
  }

  guestLogin(data: any) {
    this.userService.userRegistration(data).subscribe(Response => {
      if (Response.success == true) {
        sessionStorage.setItem('user_id', Response.data[0]._id);
        sessionStorage.setItem('userNumber', Response.data[0].userName);
        sessionStorage.setItem('userType', Response.data[0].userType);
        this.toastr.success(Response.message, "Success")
      } else {
        this.toastr.error(Response.message, "Error");
        this.router.navigate(['Login']);
      }
    }, error => {
      this.toastr.error(error.error.message, 'Error');
    })
  }


  sendInviteEmail(message: any) {
    let data = {
      email: this.inviteEmail,
      userName: this.userData,
      userId: this.userId,
      userMessage: message
    }
    this.loader = true;
    this.chatService.sendEmail(data).subscribe(Response => {
      this.toastr.success(`Mail has been sent to the ${this.inviteEmail}`, 'Success')
      this.loader = false
      this.inviteUser = false;
      this.User = true;
      this.roomUser = true;
      this.router.navigate(['./Web-Chat/Chat']);
      setTimeout(() => {
        this.ngOnInit();
      }, 1000);

    })
  }


  selectFile(event: any) {

    if (event.target.files && event.target.files.length > 0) {
      let files = event.target.files[0].name
      console.log('userfile', files)
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.file = event.target.result;
        console.log('userfile', this.file)
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

          let datauser = {
            'senderId': this.userId,
            'receiverId': this.User._id
          }
          this.chatService.getUserMessages(datauser).subscribe(Response => {
            this.userMessage = Response.data;
          })

        })
      }
    }
    console.log("Image Upload :", this.file)
  }

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
      isFirstMessage: this.userMessage.length == 0 ? true : false,
      file: this.file,
      created_at: this.User.created_at,

    };

    this.socket.emit('newMessage', data);
    this.message = '';
    this.file = '';
    const currentTime = new Date().toLocaleTimeString()
    this.socket.on('message', (data: any) => {
      this.data = data;
      this.messageReadSocke(data);
      let datauser = {
        'senderId': this.userId,
        'receiverId': this.User._id
      }
      this.getUserWithChatHistory();
      this.chatService.getUserMessages(datauser).subscribe(Response => {
        this.userMessage = Response.data;
      })
    })
  }


  selectGroupFile(event: any) {

    if (event.target.files && event.target.files.length > 0) {
      let files = event.target.files[0].name
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.groupFile = event.target.result;
        console.log('images event', this.groupFile)
        let data = {
          groupId: this.groupId,
          user_id: this.userId,
          sender_id: this.userId,
          message: files,
          file: this.groupFile,
        };


        this.socket.emit('newMessage', data);
        this.message = '';
        this.groupFile = '';
        const currentTime = new Date().toLocaleTimeString()
        this.socket.on('message', (data: any) => {

          this.data = data;
          console.log("Data From Server", data);

          let datagroup = {
            'groupId': this.groupId
          }
          this.chatService.getGroupMessages(datagroup).subscribe(Response => {
            this.groupMessage = Response.data;
            console.log(Response)
          })

        })

      }


    }
    console.log("Image Upload :", this.groupFile)
  }


  sendRoomMessage(message: any) {
    console.log('function call')
    let data = {
      username: this.userData,
      groupId: this.groupId,
      user_id: this.userId,
      sender_id: this.userId,
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
      let datagroup = {
        'groupId': this.groupId
      }
      this.chatService.getGroupMessages(datagroup).subscribe(Response => {
        this.groupMessage = Response.data;
        console.log(Response)
      })
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
      console.log('onllinnee', data);
    });
  }


  checkOnlineStatus(id: any) {
    let data = {
      sender_id: this.userId,
      receiver_id: id,

    };
    this.socket.emit('checkUserStatus', data);
    this.socket.on('checkUserStatus', (onlineUser: any) => {
      if (onlineUser.status == 'Online') {
        return true;
      } else {
        return false;
      }
    });
  }

  checkOnline(id: any) {
    let data = {
      sender_id: this.userId,
      receiver_id: id,

    };
    this.socket.emit('checkUserStatus', data);
    this.socket.on('checkUserStatus', (onlineUser: any) => {
      if (onlineUser.status == 'Online') {
        this.isUsaerOnline = true;
      } else {
        this.isUsaerOnline = false
      }
      console.log('onlineUser', onlineUser)
    });
  }

  joinGroup(room: any, selectedUserGroup: any[]) {
    selectedUserGroup.push(this.userId);
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
      // let htmlData = `  
      //       <li class="`+ className + `">
      //       <div class="media">
      //         <div class="media-body">
      //           <div class="contact-name">
      //             <h5>`+ dataFromServer + `</h5>
      //           </div>
      //         </div>
      //       </div>
      //     </li>`
      // $('#message-list').append(htmlData);
      // $("#message-list").reset();
    })
    setTimeout(() => {
      this.ngOnInit();
    }, 1000);
    this.selectedUserGroup = [];
    this.groupImage = 'assets/img/avatar.jpg';
    this.room = '';
  }

  createGroup() {
    this.selectedUserGroup = [];
    this.groupImage = 'assets/img/avatar.jpg';
    this.room = '';
  }
  leaveGroup() {
    let data = {
      groupId: '',
      user_id: this.userId,
      sender_id: this.userId,
      room: this.room,
    };

    this.socket.emit('leaveGroup', data);
    console.log("Requesting for leave : ", data);
    this.socket.on('left group', (data: any) => {
      this.data = data;
      console.log("Left group data : ", this.data);
      let className = 'replies';
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
    });
    this.roomUser = false;
    this.inviteUser = false;
    this.User = null;
    this.room = null;
    this.getAllGroups();

    this.groupMessage = [];
  }

  getUsers() {
    this.userService.getallUsers().subscribe(Response => {
      this.AllUser = Response.data;
      console.log('this.AllUser2', this.AllUser)
    })
  }

  getUserWithChatHistory() {
    let data = {
      userId: this.userId
    }
    this.userService.userListWithChatHistory(data).subscribe(Response => {
      this.allUserWithChatHistory = Response.data;
      debugger
      for (let i = 0; i < this.allUserWithChatHistory.length; i++) {

        // let checkOnline = this.checkOnlineStatus(this.allUserWithChatHistory[i]._id);
        let checkOnline = this.onlineUserList.findIndex((x: any) => x == this.allUserWithChatHistory[i]._id);
        if (checkOnline > -1) {
          this.allUserWithChatHistory[i]['isOnline'] = true;
        } else {
          this.allUserWithChatHistory[i]['isOnline'] = false;
        }
      }
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
    this.roomUser = false;
    this.inviteUser = false;
    this.User = !this.roomUser;
    this.searchUser = null;
    this.User = this.AllUser.find((userData: any) => userData._id == id);
    if (this.User && this.routeId) {
      let index = this.allUserWithChatHistory.findIndex((x: any) => x._id == this.User._id);
      if (index < 0)
        this.allUserWithChatHistory.push(this.User);
    }
    let data = {
      'senderId': this.userId,
      'receiverId': id
    }

    let readData = {
      "receiver_id": id
    }

    // setInterval(()=>{
    //   this.checkOnline(id);
    // },1000)
    this.socket.emit('readMessage', readData);
    this.loader = true;
    this.chatService.getUserMessages(data).subscribe(Response => {
      this.userMessage = Response.data;
      Response.data.forEach((element: any) => {
        if (element.receiverId == this.userId) {
          this.messageReadSocke(element);
        }
      });
      $('#message-list').append();
      this.loader = false;
    })
  }

  OpenChatRoomBox(id: any) {
    this.groupMessage = [];
    this.groupId = id;
    this.senderUserId = '';
    this.roomUser = true;
    this.User = !this.roomUser;

    this.room = this.groupNames.find((roomData: any) => roomData._id == id);
    let data = {
      'groupId': id
    }
    this.loader = true;
    this.chatService.getGroupMessages(data).subscribe(Response => {
      this.groupMessage = Response.data;
      console.log(Response)
      this.loader = false;
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
  validURL(str: any) {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (!regex.test(str)) {
      return false;
    } else {
      return true;
    }
  }
  getUserByAId(id: any) {
    this.User = this.AllUser.find((userData: any) => userData._id == id);
  }
  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/'])
      .then(() => {
        localStorage.clear();
        sessionStorage.clear();
        this.goOffline()
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
        userName: this.userData,
        userId: this.userId,
        userMessage: this.message
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
  checkUserExist() {
    this.showInvite = false;
    console.log(this.searchUser);
    let user = this.AllUser.findIndex((x: any) => (x.email.indexOf(this.searchUser) > -1 || x.userName.indexOf(this.searchUser) > -1));
    console.log(user);
    if (user < 0) {
      this.showInvite = true;
    } else {
      let userData = this.AllUser.filter((x: any) => (x.email == this.searchUser || x.userName == this.searchUser));
      this.showGuestUserList = userData;
      this.showInvite = false;
    }

  }

  sendInvite(email: any) {
    if (email == null || email == '') {
      this.toastr.error('Please Enter Email', 'Error')
      return false
    }
    if (email.match("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")) {
      this.router.navigate(['/Web-Chat/Chat', { inviteEmail: email }])

      setTimeout(() => {
        this.ngOnInit();
      }, 1000);

    } else {
      this.toastr.error('Please Enter valid Email', 'Error')
      return false
    }
  }

  emailChatTranscript(email: any) {
    if (email == null || email == '') {
      this.toastr.error('Please Enter Email', 'Error')
      return false
    }
    if (email.match("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")) {
      let data = {
        email: email,
        userName: this.userData,
        ReceiverUser: this.User.userName,
        userId: this.userId,
        userMessage: this.userMessage
      }
      this.loader = true
      this.chatService.sendEmailForChat(data).subscribe(Response => {
        this.toastr.success(`Mail has been sent to the ${email}`, 'Success')
        this.loader = false
        document.getElementById('emailChatModal')?.click()
      })
    } else {
      this.toastr.error('Please Enter valid Email', 'Error')
      return false
    }

  }

  deleteChatBySender(receiverId: any) {
    let data = {
      senderId: this.userId,
      receiverId: receiverId
    }
    this.chatService.chatDeleteBySender(data).subscribe(Response => {
      if (Response.data.nModified == 1) {
        this.toastr.error('Guset Session Closed', 'Success')
      }
    })
  }

  copy(text: any) {
    var input = document.createElement('input');
    input.setAttribute('value', text);
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input);
    this.toastr.success('Invitaion Link Copy Successfully', 'Success');
    return result;
  }
  deleteUser(userId: any) {
    let data = {
      "userId": userId
    }
    this.userService.deleteUser(data).subscribe(Response => {
      console.log(Response);
    })
  }

  getGroupId(groupId: any) {
    this.groupId = groupId
  }

  editGroup(groupId: any, userId: any) {
    let data = {
      groupId: groupId,
      newMemberId: userId
    }
    this.chatService.editChatGroup(data).subscribe(Response => {
      if (Response.data.nModified == 1) {
        this.toastr.success('Joined group successfully', 'Success')
        this.getAllGroups();
        this.router.navigate(['./Web-Chat/Chat']);
        setTimeout(() => {
          this.OpenChatRoomBox(groupId)
        }, 3000)
      } else {
        this.toastr.warning('You are already a member this group', 'Success')
        this.router.navigate(['./Web-Chat/Chat']);
      }
    }, err => {
      console.log(err)
      this.toastr.error(err.error.message, 'Error')
    })
  }

  disableChat(selectedUser: any) {
    let data = {
      senderId: this.userId,
      receiverId: selectedUser
    }
    this.chatService.chatDisable(data).subscribe(Response => {
      if (Response.data.nModified == 1) {
        this.toastr.success('Chat disable successfully', 'Success')
        this.OpenChatBox(selectedUser)
      }
    })
  }

  enableChat(selectedUser: any) {
    let data = {
      senderId: this.userId,
      receiverId: selectedUser
    }
    this.chatService.chatEnable(data).subscribe(Response => {
      if (Response.data.nModified == 1) {
        this.toastr.success('Chat enable successfully', 'Success')
        this.OpenChatBox(selectedUser)
      }
    }, err => {
      console.log(err)
      this.toastr.error(err.error.message, 'Error')
    })
  }

  deleleConverstion() {
    let data = {
      senderId: this.userId,
      receiverId: this.User._id
    }
    this.chatService.DeleteConversation(data).subscribe(Response => {
      if (Response.data1.nModified > 0 || Response.data2.nModified) {
        this.toastr.success('Converstion Delete successfully', 'Success')
        this.getUserWithChatHistory();
        this.OpenChatBox(this.User._id)
      }
    }, err => {
      console.log(err)
      this.toastr.error(err.error.message, 'Error')
    })
  }

  goOffline() {
    console.log('offline called')
    this.socket.emit('goOffline', this.userId)
    console.log('status', status)
    this.socket.on('offline', (offlineUser: any) => {
      console.log('offlineUser', offlineUser)
    });
  }
  ngOnDestroy() {
    if (this.userType == "guestUser") {
      // this.deleteUser(this.userId);
    }
  }

}
