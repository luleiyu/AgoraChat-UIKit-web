import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import { makeStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import {
  Box,
  IconButton,
  MenuItem,
  TextareaAutosize,
  Menu,
} from "@material-ui/core";
import EmojiComponent from "./toolbars/emoji";
import { useDispatch, useSelector } from "react-redux";
import MessageActions from "../../redux/message";
import PropTypes from "prop-types";
import i18next from "i18next";
import WebIM from "../../utils/WebIM";
import { EaseChatContext } from "./index";

import Recorder from "./messages/recorder";
import icon_emoji from "../../common/icons/emoji@2x.png";
import icon_yuyin from "../../common/icons/voice@2x.png";
import attachment from "../../common/icons/attachment@2x.png";
import { message } from '../common/alert'
import { emoji } from "../../common/emoji";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    background: "#fff",
    borderRadius: "2px",
    position: "absolute",
    bottom: '-25px',
    padding: "10px 0",
  },
  emitter: {
    display: "flex",
    alignItems: "flex-end",
    padding: "0 16px",
  },
  input: {
    outline: "none",
    flex: 1,
    lineHeight: "17px",
    fontSize: "14px",
    border: "none",
    color: "#010101",
    resize: "none",
    backgroundColor: "#efefef",
    borderRadius: "18px",
    padding: "5px",
    fontFamily: 'Roboto',
    width: '96%',
  },
  senderBar: {
    height: "12px",
    width: "12px",
    cursor: "pointer",
  },
  hide: {
    display: "none",
  },
  iconStyle: {
    width: "30px",
    height: "30px",
  },
  menuItemIconBox: {
    marginRight: "5px",
    display: "flex",
  },
  textareaBox: {
    backgroundColor: "#efefef",
    width: '100%',
    borderRadius: "18px",
    minHeight: '36px',
    padding: '10px 0 0 8px',
  },
  iconbtnStyle: {
    padding: '2px',
    margin: '6px 0',
  }
}));
const regex = /(\[.*?\])/g;

function SendBox(props) {
  let easeChatProps = useContext(EaseChatContext);
  const { easeInputMenu, menuList, handleMenuItem, onOpenThreadPanel } = easeChatProps;
  const dispatch = useDispatch();
  const classes = useStyles();
  const globalProps = useSelector((state) => state.global.globalProps);
  let { chatType, to } = globalProps;
  const emojiRef = useRef(null);
  const fileEl = useRef(null);
  const videoEl = useRef(null)
  const [emojiVisible, setEmojiVisible] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const inputValueRef = useRef(null);
  const imageEl = useRef(null);
  const [sessionEl, setSessionEl] = useState(null);
  const [showRecorder, setShowRecorder] = useState(false);
  inputValueRef.current = inputValue;
  const handleClickEmoji = (e) => {
    setEmojiVisible(e.currentTarget);
  };
  const handleEmojiClose = () => {
    setEmojiVisible(null);
  };
  const handleEmojiSelected = (val) => {
    if (!val) return;
    console.log(val, 'val', emoji.map[val])
    setEmojiVisible(null);
    setInputValue((value) => value + val);
    const inputText = inputValue + val

    const TextString = renderTxt(inputText)
    console.log(TextString, 'TextString')
    // inputRef.current.textContent = inputText
    inputRef.current.innerHTML = TextString
    setTimeout(() => {
      // console.log(inputValueRef, inputRef)
      // let el = inputRef.current;
      // const s = window.getSelection();
      // const r = document.createRange();
      // let idx = 1
      // if (el.childNodes[0].nodeName === '#text') {
      //   idx = el.childElementCount + 1
      // } else {
      //   idx = el.childElementCount
      // }
      // console.log(s, r)
      // r.setStart(el, idx);
      // r.collapse(true)
      // s.removeAllRanges();
      // s.addRange(r);
      // el.focus();
      // el.selectionStart = inputValueRef.current.length;
      // el.selectionEnd = inputValueRef.current.length;
    }, 0);
  };
  const inserCurosrHtml = (t, e) => {
    var i = document.querySelector(".chat-input");
    i.innerText.length;
    if ("getSelection" in window) {
      var s = window.getSelection();
      if (s && 1 === s.rangeCount) {
        i.focus();
        var n = s.getRangeAt(0),
          a = new Image;
        a.src = t, a.setAttribute("data-key", e), a.draggable = !1, a.className = "emoj-insert", a.setAttribute("title", e.replace("[", "").replace("]", "")), n.deleteContents(), n.insertNode(a), n.collapse(!1), s.removeAllRanges(), s.addRange(n)
      }
    } else if ("selection" in document) {
      i.focus(), (n = document.selection.createRange()).pasteHTML('<img class="emoj-insert" draggable="false" data-key="' + e + '" title="' + e.replace("[", "").replace("]", "") + '" src="' + t + '">'), i.focus()
    }
  }
  const handelrDivClick = e => {
    console.log(e, 'click', inputRef)
    let idx = 'str'
    inputRef.current.childNodes.forEach(((item, index) => {
      if (e.target.tagName === 'IMG' && item.alt === e.target.alt) {
        console.log(index)
        idx = index
      }
    }))
    if (Number(idx).toString() !== 'NaN') {
      let el = inputRef.current;
      const s = window.getSelection();
      const r = document.createRange();
      console.log(s, r)
      r.setStart(el, idx);
      r.collapse(true)
      s.removeAllRanges();
      s.addRange(r);
    }
  }
  const handleInputChange = (e) => {
    console.log(e, 'input')
    // setInputValue((value) => value + e.target.textContent);
    setInputValue(e.target.textContent);
  };
  const isCreatingThread = useSelector((state) => state.thread?.isCreatingThread);
  const currentThreadInfo = useSelector((state) => state.thread?.currentThreadInfo);
  const threadOriginalMsg = useSelector((state) => state.thread?.threadOriginalMsg);
  const threadPanelStates = useSelector((state) => state.thread?.threadPanelStates);
  useEffect(()=>{
    if(threadPanelStates){
      setInputValue('')
    }
  },[isCreatingThread,currentThreadInfo?.id,threadOriginalMsg?.id,threadPanelStates])
  const createChatThread = ()=>{
    return new Promise((resolve,reject) => {
      if (isCreatingThread && props.isChatThread) {
        if (!props.threadName) {
          message.warn(i18next.t('ThreadName can not empty'));
          imageEl.current.value = null;
          fileEl.current.value = null;
          videoEl.current.value = null;
          return;
        }
        const options = {
          name: props.threadName.replace(/(^\s*)|(\s*$)/g, ""),
          messageId: threadOriginalMsg.id,
          parentId: threadOriginalMsg.to,
        }
        WebIM.conn.createChatThread(options).then(res=>{
          const threadId = res.data?.chatThreadId;
          onOpenThreadPanel && onOpenThreadPanel({id: threadId})
          resolve(threadId)
        })
      }else if(props.isChatThread){
        resolve(currentThreadInfo.id)
      }else {
        resolve(to)
      }
    })
  }
  const sendMessage = useCallback(() => {
    if (!inputValue) return;
    createChatThread().then(to=>{
      dispatch(
        MessageActions.sendTxtMessage(to, chatType, {
          msg: inputValue,
        }, props.isChatThread)
      );
      setInputValue("");
      inputRef.current.focus();
      inputRef.current.textContent = ''
    })
  }, [inputValue, to, chatType, dispatch,currentThreadInfo,props ]);

  const onKeyDownEvent = useCallback(
    (e) => {
      if (e.keyCode === 13 && e.shiftKey) {
        e.preventDefault();
        inputRef.current.value += "\n";
      } else if (e.keyCode === 13) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  useEffect(() => {
    inputRef.current.addEventListener("keydown", onKeyDownEvent);
    return function cleanup() {
      let _inputRef = inputRef;
      _inputRef &&
        _inputRef?.current?.removeEventListener("keydown", onKeyDownEvent);
    };
  }, [onKeyDownEvent]);

  const handlefocus = (v) =>{
    const {value} = v
    switch (value) {
      case 'img':
        imageEl.current.focus();
        imageEl.current.click();
        break;
      case 'file':
        fileEl.current.focus();
        fileEl.current.click();
        break;
      case 'video':
        videoEl.current.focus();
        videoEl.current.click();
      default:
        break;
    }
  }
  const handleFileChange = (e) => {
    let file = WebIM.utils.getFileUrl(e.target);
    if (!file.filename) {
      return false;
    }
    createChatThread().then(to=>{
      dispatch(MessageActions.sendFileMessage(to, chatType, file, fileEl, props.isChatThread));
    })
  }
  const handleVideoChange = (e) => {
    let file = WebIM.utils.getFileUrl(e.target);
    if (!file.filename) {
      return false;
    }
    createChatThread().then(to=>{
      dispatch(MessageActions.sendVideoMessage(to, chatType, file,videoEl, props.isChatThread));
    })
  }
  const handleImageChange = (e) => {
    let file = WebIM.utils.getFileUrl(e.target);
    if (!file.filename) {
      return false;
    }
    createChatThread().then(to=>{
      dispatch(MessageActions.sendImgMessage(to, chatType, file, imageEl, props.isChatThread));
    })
    
  };
  const handleClickMenu = (e) => {
    setSessionEl(e.currentTarget);
  };

  const onClickMenuItem = (v) => (e) => {
    handleMenuItem && handleMenuItem(v,e)
    handlefocus(v)
    setSessionEl(null);
  };

  const renderTxt = (txt) => {
		if (txt === undefined) {
			return [];
		}
		let rnTxt = [];
		let match = null;
		const regex = /(\[.*?\])/g;
		let start = 0;
		let index = 0;
		while ((match = regex.exec(txt))) {
			index = match.index;
			if (index > start) {
				rnTxt.push(txt.substring(start, index));
			}
			if (match[1] in emoji.map) {
				const v = emoji.map[match[1]];
				rnTxt.push(
					`<img
            title=${match[1]}
						key=${v + Math.floor(Math.random() * 99 + 1) + new Date().getTime().toString()}
						alt=${v + Math.floor(Math.random() * 99 + 1)}
						src=${require(`../../common/reactions/${v}`).default}
						width=20
						height=20
						style="vertical-align: middle"
					/>`
				);
			} else {
				rnTxt.push(match[1]);
			}
			start = index + match[1].length;
		}
		rnTxt.push(txt.substring(start, txt.length));

		return rnTxt.join('');
	};

  /*------------ ui-menu ----------*/
  const renderMenu = () => {
    return (
      <Menu
        id="simple-menu"
        anchorEl={sessionEl}
        keepMounted
        open={Boolean(sessionEl)}
        onClose={() => setSessionEl(null)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        {menuList && menuList.map((option, index) => {
          return (
            <MenuItem onClick={onClickMenuItem(option)} key={index}>
              <Box className={classes.menuItemIconBox}></Box>
              <Typography variant="inherit" noWrap>
                {i18next.t(option.name)}
              </Typography>
              {option.value === "img" && (
                <input
                  type="file"
                  accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                  ref={imageEl}
                  onChange={handleImageChange}
                  className={classes.hide}
                />
              )}
              {option.value === "file" && (
                <input
                  ref={fileEl}
                  onChange={handleFileChange}
                  type="file"
                  className={classes.hide}
                />
              )}
               {option.value === "video" && (
                <input
                  ref={videoEl}
                  onChange={handleVideoChange}
                  type="file"
                  className={classes.hide}
                />
              )}
            </MenuItem>
          );
        })}
      </Menu>
    );
  };

  const renderRecorder = () => {
    return (
      <>
        {window.location.protocol === "https:" && (
          <IconButton
            className={classes.iconbtnStyle}
            onClick={() => {
              setShowRecorder(true);
            }}
          >
            <img alt="" className={classes.iconStyle} src={icon_yuyin} />
          </IconButton>
        )}
        <Recorder
          open={showRecorder}
          onClose={() => {
            setShowRecorder(false);
          }}
          isChatThread = {props.isChatThread}
          threadName = {props.threadName}
        />
      </>
    );
  };

  const renderTextarea = () => {
    return (
      <>
      {/* <div className={classes.textareaBox}>
        <TextareaAutosize
          placeholder="Say Something"
          className={classes.input}
          minRows={1}
          maxRows={3}
          value={inputValue}
          onChange={handleInputChange}
          ref={inputRef}
        ></TextareaAutosize>
      </div> */}
      <div contenteditable="true" className={classes.textareaBox + ' ' + 'chat-input'} ref={inputRef} onClick={handelrDivClick} onInput={handleInputChange}>
        {/* {renderTxt(inputValue)} */}
      </div>
      </>
    );
  };

  const renderEmoji = () => {
    return (
      <>
        <IconButton ref={emojiRef} className={classes.iconbtnStyle} onClick={handleClickEmoji}>
          <img alt="" className={classes.iconStyle} src={icon_emoji} />
        </IconButton>
        <EmojiComponent
          anchorEl={emojiVisible}
          onSelected={handleEmojiSelected}
          onClose={handleEmojiClose}
        ></EmojiComponent>
      </>
    );
  };

  const renderMoreFeatures = () => {
    return (
      <>
        <IconButton className={classes.iconbtnStyle} onClick={handleClickMenu}>
          <img alt="" className={classes.iconStyle} src={attachment} />
        </IconButton>
        {renderMenu()}
      </>
    );
  };

  const renderConditionModule = () => {
    switch (easeInputMenu) {
      case "all":
        return (
          <>
            {renderRecorder()}
            {renderTextarea()}
            {renderEmoji()}
            {renderMoreFeatures()}
          </>
        );
      case "noAudio":
        return (
          <>
            {renderTextarea()}
            {renderEmoji()}
            {renderMoreFeatures()}
          </>
        );
      case "noEmoji":
        return (
          <>
            {renderRecorder()}
            {renderTextarea()}
            {renderMoreFeatures()}
          </>
        );
      case "noAudioAndEmoji":
        return (
          <>
            {renderTextarea()}
            {renderMoreFeatures()}
          </>
        );
      case "onlyText":
        return <>{renderTextarea()}</>;
      default:
        break;
    }
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.emitter}>{renderConditionModule()}</Box>
    </Box>
  );
}
export default memo(SendBox);
