import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';
import { Link } from 'react-router-dom';
import '../css/MyPage.css';
import userIcon from '../image/user.png';

const MyPage = () => {
  const { auth } = useContext(AuthContext);
  const [userPosts, setUserPosts] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [postPage, setPostPage] = useState(1);
  const [commentPage, setCommentPage] = useState(1);
  const [likePage, setLikePage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [hasMoreLikes, setHasMoreLikes] = useState(true);

  useEffect(() => {
    if (auth.user) {
      fetchUserPosts(postPage);
      fetchUserComments(commentPage);
      fetchLikedPosts(likePage);
    }
  }, [auth.user, postPage, commentPage, likePage]);

  const fetchUserPosts = async (page) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${auth.user.username}/posts`, {
        params: { page, limit: 5 },
        withCredentials: true
      });
      setUserPosts(response.data);
      setHasMorePosts(response.data.length === 5);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      setUserPosts([]);
    }
  };

  const fetchUserComments = async (page) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${auth.user.username}/comments`, {
        params: { page, limit: 5 },
        withCredentials: true
      });
      setUserComments(response.data);
      setHasMoreComments(response.data.length === 5);
    } catch (error) {
      console.error('Error fetching user comments:', error);
      setUserComments([]);
    }
  };

  const fetchLikedPosts = async (page) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${auth.user.username}/likes`, {
        params: { page, limit: 5 },
        withCredentials: true
      });
      setLikedPosts(response.data);
      setHasMoreLikes(response.data.length === 5);
    } catch (error) {
      console.error('Error fetching liked posts:', error);
      setLikedPosts([]);
    }
  };

  if (!auth.user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mypage-container">
      <div className="sidebar">
        <img src={userIcon} alt="User" className="user-icon" />
        <h2>{auth.user.username}</h2>
        <p>{auth.user.email}</p>
        <div className="sidebar-menu">
          <p>내 정보</p>
          <p>알림함</p>
          <p>공지사항</p>
          <p>로그아웃</p>
        </div>
      </div>
      <div className="content">
        <div className="content-section">
          <h2>작성한 글</h2>
          <table className="table">
            <thead>
              <tr>
                <th>제목</th>
                <th>작성일</th>
                <th>조회수</th>
                <th>추천수</th>
              </tr>
            </thead>
            <tbody>
              {userPosts && userPosts.length > 0 ? (
                userPosts.map(post => (
                  <tr key={post.id}>
                    <td><Link to={`/posts/${post.id}`}>{post.title}</Link></td>
                    <td>{new Date(post.created_at).toLocaleString()}</td>
                    <td>{post.views}</td>
                    <td>{post.likes}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">작성한 글이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="pagination">
            <button disabled={postPage === 1} onClick={() => setPostPage(postPage - 1)}>이전</button>
            <button disabled={!hasMorePosts} onClick={() => setPostPage(postPage + 1)}>다음</button>
          </div>
        </div>
        <div className="content-section">
          <h2>작성한 댓글</h2>
          <table className="table">
            <thead>
              <tr>
                <th>댓글 내용</th>
                <th>작성일</th>
                <th>게시글 제목</th>
              </tr>
            </thead>
            <tbody>
              {userComments && userComments.length > 0 ? (
                userComments.map(comment => (
                  <tr key={comment.id}>
                    <td><Link to={`/posts/${comment.post_id}#${comment.id}`}>{comment.content}</Link></td>
                    <td>{new Date(comment.created_at).toLocaleString()}</td>
                    <td><Link to={`/posts/${comment.post_id}`}>{comment.post_title}</Link></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">작성한 댓글이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="pagination">
            <button disabled={commentPage === 1} onClick={() => setCommentPage(commentPage - 1)}>이전</button>
            <button disabled={!hasMoreComments} onClick={() => setCommentPage(commentPage + 1)}>다음</button>
          </div>
        </div>
        <div className="content-section">
          <h2>좋아요 누른 글</h2>
          <table className="table">
            <thead>
              <tr>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>조회수</th>
                <th>추천수</th>
              </tr>
            </thead>
            <tbody>
              {likedPosts && likedPosts.length > 0 ? (
                likedPosts.map(post => (
                  <tr key={post.id}>
                    <td><Link to={`/posts/${post.id}`}>{post.title}</Link></td>
                    <td>{post.username}</td>
                    <td>{new Date(post.created_at).toLocaleString()}</td>
                    <td>{post.views}</td>
                    <td>{post.likes}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">좋아요 누른 글이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="pagination">
            <button disabled={likePage === 1} onClick={() => setLikePage(likePage - 1)}>이전</button>
            <button disabled={!hasMoreLikes} onClick={() => setLikePage(likePage + 1)}>다음</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
