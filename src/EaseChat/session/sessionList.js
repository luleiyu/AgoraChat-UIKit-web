import React, { useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { useSelector, useDispatch } from "../../EaseApp/index";
import { renderTime } from "../../utils/index";
import {EaseAppContext} from '../../EaseApp/index'
import _ from 'lodash'
import groupIcon from "../../common/images/groupAvatar.png";
import chatRoomIcon from "../../common/images/chatroom@2x.png";
import noticeIcon from "../../common/images/notice@2x.png";
import avatarIcon1 from '../../common/images/avatar1.png'
import avatarIcon2 from '../../common/images/avatar2.png'
import avatarIcon3 from '../../common/images/avatar3.png'

import i18next from "i18next";


const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    margin: '0 !important',
    padding: '0 !important',
    overflowY: 'auto',
  },
  listItem: {
    padding: "0 14px",
  },
  itemBox: {
    display: "flex",
    flex: 1,
    height: "100%",
    alignItems: "center",
    boxSizing: "border-box",
    padding:'5px 0'
  },
  avatar: {
    height: "40px !important",
    width: "40px !important",
    overflow: "inherit !important",
  },
  MuiListItemTextSecondary: {
    color: "red",
  },
  itemRightBox: {
    flex: 1,
  },
  itemName: {
    fontSize: "16px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemMsgBox: {
    position: "relative",
    height: "20px",
    display: "flex",
    alignItems: "center",
  },
  time: {
    display: "inline-block",
    height: "17px",
    fontSize: "12px",
    color: "rgba(1, 1, 1, .6)",
    marginRight: "2px",
  },
  itemMsg: {
    display: "inline-block",
    height: "20px",
    overflow: "hidden",
    color: "rgba(1, 1, 1, .6)",
    width: "calc(100% - 18px)",
    fontSize: "14px",
    wordBreak: 'break-all'
  },
  unreadNum: {
    color: "#fff",
    background: "rgba(245, 12, 205, 1)",
    display: "inline-block",
    height: "16px",
    borderRadius: "8px",
    fontSize: "10px",
    minWidth: "16px",
    textAlign: "center",
    position: "absolute",
    right: "0",
  },
}));

export default function SessionList(props) {
  let easeAppProps = useContext(EaseAppContext)
  const {isShowUnread,unreadType} = easeAppProps
  const classes = useStyles();
  const sessionList = useSelector((state) => state.session?.sessionList) || [];
  const to = useSelector((state) => state.global.globalProps.to);
  const message = useSelector((state) => state.message);
  const { unread } = message;
  const currentSession = useSelector((state) => state.session?.currentSession);
  let currentSessionIndex = null;
  const joinedGroups = useSelector((state) => state.session?.joinedGroups);
  // dealwith notice unread num
  const notices = useSelector((state) => state.notice?.notices) || [];
  let noticeUnreadNum = 0;
  notices.forEach((item) => {
    if (!item.disabled) {
      noticeUnreadNum++;
    }
  });
  const renderSessionList = sessionList
    .asMutable({ deep: true })
    .map((session) => {
      const chatMsgs =
        message?.[session.sessionType]?.[session.sessionId] || [];
      if (chatMsgs.length > 0) {
        let lastMessage = chatMsgs[chatMsgs.length - 1];
        let val = lastMessage.body || ''
        if (val && val.type === 'recall') {
          session.lastMessage = {
            time: lastMessage.time,
            body: {
              msg: lastMessage.chatType === 'singleChat' && lastMessage.bySelf? i18next.t("you retracted a message"):`${lastMessage.from}${i18next.t("retracted a message")}`,
            },
          }
        }else{
          session.lastMessage = lastMessage
        }
        session.unreadNum = unread[session.sessionType][session.sessionId];
      }
      if (session.sessionType === "notice") {
        if (notices.length) {
          let msg;
          session.unreadNum = noticeUnreadNum;
          if (notices[notices.length - 1].type === "joinGroupNotifications") {
            msg =
              "Request to join the group:" + notices[notices.length - 1].gid;
          } else {
            msg = notices[notices.length - 1]?.status;
          }
          session.lastMessage = {
            time: notices[notices.length - 1].id,
            body: {
              msg: msg,
            },
          };
        }
      }
      return session;
    })
    .sort((a, b) => {
      if (!a?.lastMessage?.time) return 1;
      if (!b?.lastMessage?.time) return -1;
      return b?.lastMessage?.time - a?.lastMessage?.time;
    });
  renderSessionList.forEach((element, index) => {
    if (element.sessionId === currentSession) {
      currentSessionIndex = index;
    }
  });

  const handleListItemClick = (event, index, session) => {
    if (currentSessionIndex !== index || !to) {
      props.onClickItem(session);
    }
  };

  const searchSession = (e) =>{
    let ary = []
    if (e.target.value) {
      renderSessionList.map((val,key)=>{
        let isIncludeAry = val.sessionType === 'groupChat'? val.name : val.sessionId
        let isIncludeVal = _.includes(_.toLower(isIncludeAry),_.toLower(e.target.value))
        if (isIncludeVal) {
          ary.push(val)
        }
        setSearchAry(_.uniq(ary))
      })
    }else{
      setSearchAry([])
    }
  }


  let userAvatars = {
    1: avatarIcon1,
    2: avatarIcon2,
    3: avatarIcon3
  }
 let renderSession = searchAry && searchAry.length>0?searchAry:renderSessionList


const deleteSessionClick = (v) =>{
  let newAry = _.filter(searchAry,(o)=>{
    return v.sessionId !== o.sessionId
  })
  setSearchAry(newAry)
}
  return (
    <>
    <Paper component="form" className={classes.paper}
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center'}}>
      <IconButton aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        className={classes.inputBase}
        sx={{ ml: 1, flex: 2 }}
        placeholder="Search"
        onChange={searchSession}
      />
    </Paper>
      <List dense className={classes.root}>
        {renderSession.map((session, index) => {
          let usersInfoData = localStorage.getItem("usersInfo_1.0")
          let avatarSrc = "";
          if (session.sessionType === "singleChat") {
            let findIndex =  _.find(usersInfoData, { username: session.sessionId }) || ''
            avatarSrc = userAvatars[findIndex.userAvatar] || avatarIcon1
          }else if (session.sessionType === "groupChat") {
            avatarSrc = groupIcon;
          } else if (session.sessionType === "chatRoom") {
            avatarSrc = chatRoomIcon;
          } else if (session.sessionType === "notice") {
            avatarSrc = noticeIcon;
          }
          return (
            <SessionItem 
            key={index} 
            currentVal={{session,index,currentSessionIndex,avatarSrc}} 
            handleListItemClick={handleListItemClick}
            deleteSessionClick={deleteSessionClick}
            />
          );
        })}
      </List>
      </>
  );
}

SessionList.defaultProps = {};
