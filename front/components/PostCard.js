import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types';
import { Card, Popover, Button, Avatar, Comment, List } from "antd";
import { RetweetOutlined, HeartOutlined, MessageOutlined, EllipsisOutlined, HeartTwoTone } from '@ant-design/icons';
import PostImages from './PostImages';
import CommentForm from './CommentForm';
import PostCardContent from "./PostCardContent";
import { LIKE_POST_REQUEST, REMOVE_POST_REQUEST, UNLIKE_POST_REQUEST, RETWEET_REQUEST } from '../reducers/post';
import FollowButton from './FollowButton';
import Link from 'next/link';
import moment from 'moment';

moment.locale('ko');  // 한글로 변환

const PostCard = ({ post }) => {

  const dispatch = useDispatch()
  const { removePostLoading } = useSelector((state) => state.post)
  const [commentFormDepend, setCommentFormDepend] = useState(false)
  const id = useSelector((state) => state.user.me?.id)

  const onLike = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.')
    }
    return dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id
    })
  }, [id])

  const onUnlike = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.')
    }
    return dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id
    })
  }, [id])


  const onToggleComment = useCallback(() => {
    setCommentFormDepend((prev) => !prev)
  }, [])

  const onRemovePost = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.')
    }
    return dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id
    })
  }, [id])

  const onRetweet = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.')
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id
    })
  }, [id])
  
  const liked = post.Likers.find((v) => v.id === id)
  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" onClick={onRetweet} />,
          liked 
            ? <HeartTwoTone twoToneColor="#EB2F96" key='heart' onClick={onUnlike} /> 
            : <HeartOutlined key='heart' onClick={onLike} />
          ,
          <MessageOutlined key='comment' onClick={onToggleComment} />,
          <Popover key='ellipsis' content={(
            <Button.Group>
              {id && post.User.id === id 
                ? (
                    <>
                      <Button>수정</Button>
                      <Button 
                        type='danger' 
                        onClick={onRemovePost}
                        loading={removePostLoading}
                      >삭제</Button>
                    </> 
                  ) 
                : <Button>신고</Button>
              }
            </Button.Group>
          )}>
            <EllipsisOutlined />
          </Popover>
        ]}
        title={post.Retweet ? `${post.User.nickname}님이 리트윗하였습니다.` : null}
        extra={id && <FollowButton post={post} />}
      >
        {post.RetweetId && post.Retweet 
          ? (
            <Card cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}>
              <div style={{ float: 'right '}}>{moment(post.createdAt).format('YYYY.MM.DD')}</div>
              <Card.Meta 
                avatar={(
                  <Link href={`/user/${post.Retweet.User.id}`}>
                    <a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a>
                  </Link>
                )}
                title={post.Retweet.User.nickname}
                description={<PostCardContent postData={post.Retweet.content} />
                }
              />
            </Card>
            ) 
          : (
            <>
              <div style={{ float: 'right '}}>{moment(post.createdAt).format('YYYY.MM.DD')}</div>
              <Card.Meta 
              avatar={(
                <Link href={`/user/${post.User.id}`}>
                  <a><Avatar>{post.User.nickname[0]}</Avatar></a>
                </Link>
              )}
                title={post.User.nickname}
                description={<PostCardContent postData={post.content} />}
              />
            </>
            )
        }
      </Card>
      {commentFormDepend && (
        <div>
          <CommentForm post={post} />
          <List 
            header={`${post.Comments.length}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={(
                    <Link href={`/user/${item.User.id}`}>
                      <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                    </Link>
                  )}
                  content={item.content}
                />
              </li>
            )}
          />
        </div>
      )}
      {/* <CommnetForm />
      <Commnets /> */}
    </div>
  )
}

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any)
  }).isRequired
}

export default PostCard;