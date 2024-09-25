import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const NewsManagement = () => {
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState({
    title: '',
    category: '',
    shortDescription: '',
    content: '',
    image: null
  });

  useEffect(() => {
    // Fetch posts from API
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    // TODO: Implement API call to fetch posts
    // const response = await fetch('/api/posts');
    // const data = await response.json();
    // setPosts(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPost(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content) => {
    setCurrentPost(prev => ({ ...prev, content }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setCurrentPost(prev => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement API call to create/update post
    // const response = await fetch('/api/posts', {
    //   method: 'POST',
    //   body: JSON.stringify(currentPost),
    //   headers: { 'Content-Type': 'application/json' }
    // });
    // if (response.ok) {
    //   fetchPosts();
    //   setCurrentPost({ title: '', category: '', shortDescription: '', content: '', image: null });
    // }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Hantera Nyhetsinlägg
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          name="title"
          label="Titel"
          value={currentPost.title}
          onChange={handleInputChange}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Kategori</InputLabel>
          <Select
            name="category"
            value={currentPost.category}
            onChange={handleInputChange}
          >
            <MenuItem value="news">Nyheter</MenuItem>
            <MenuItem value="openinghours">Öppettider</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          name="shortDescription"
          label="Kort beskrivning"
          multiline
          rows={2}
          value={currentPost.shortDescription}
          onChange={handleInputChange}
        />
        <ReactQuill
          theme="snow"
          value={currentPost.content}
          onChange={handleEditorChange}
        />
        <input
          accept="image/*"
          type="file"
          onChange={handleImageUpload}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Publicera
        </Button>
      </form>
      {/* TODO: Add list of existing posts with edit and delete options */}
    </Box>
  );
};

export default NewsManagement;
