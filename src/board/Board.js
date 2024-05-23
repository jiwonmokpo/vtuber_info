import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';

const Board = () => {
  const { auth } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/posts?page=${page}`);
      if (response.data.length < 10) {
        setHasMore(false);
      }
      setPosts((prevPosts) => {
        // 중복된 id를 가진 게시글을 제거하고 새로운 게시글을 추가합니다.
        const newPosts = response.data.filter(
          (newPost) => !prevPosts.some((post) => post.id === newPost.id)
        );
        return [...prevPosts, ...newPosts];
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/posts/${postId}`, { withCredentials: true });
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div>
      <h1>게시판</h1>
      <div>
        {posts.map((post) => (
          <div key={post.id} className="post">
            <h2>
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </h2>
            <p>{post.content}</p>
            <p>작성자: {post.username}</p>
            <p>작성일: {new Date(post.created_at).toLocaleString()}</p>
            {auth.user && auth.user.username === post.username && (
              <>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="pagination">
        {page > 1 && <button onClick={() => setPage(page - 1)}>이전</button>}
        {hasMore && <button onClick={() => setPage(page + 1)}>다음</button>}
      </div>
      {auth.loggedIn && (
        <div className="write-button">
          <Link to="/write">글쓰기</Link>
        </div>
      )}
    </div>
  );
};

export default Board;
