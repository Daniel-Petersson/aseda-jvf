import React, { useState, useContext, useEffect } from 'react';
import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Modal } from '@mui/material';
import { AuthContext } from '../../utils/AuthContext';
import { getAllNews, createNews, updateNews, deleteNews } from '../../services/NewsService';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const NewsManagement = () => {
  const { user } = useContext(AuthContext);
  const isAuthenticated = user && user.role === 'ADMIN';
  const [newsList, setNewsList] = useState([]);
  const [currentPost, setCurrentPost] = useState({
    title: '',
    content: '',
    authorId: user ? user.memberId : '',
    pictureUrl: '',
    fileUrl: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      const result = await getAllNews();
      if (result.success) {
        setNewsList(result.data);
      }
    };
    fetchNews();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const postData = { ...currentPost, authorId: user.memberId };
    console.log('Data being sent:', postData);
    if (isEditing) {
      await updateNews(currentPost.id, postData);
    } else {
      await createNews(postData);
    }
    const result = await getAllNews();
    if (result.success) {
      setNewsList(result.data);
    }
    setCurrentPost({
      title: '',
      content: '',
      authorId: user ? user.memberId : '',
      pictureUrl: '',
      fileUrl: ''
    });
    setIsEditing(false);
    setModalOpen(false);
  };

  const handleEdit = (newsItem) => {
    setCurrentPost(newsItem);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDelete = async (newsId) => {
    await deleteNews(newsId);
    const result = await getAllNews();
    if (result.success) {
      setNewsList(result.data);
    }
  };

  if (!isAuthenticated) {
    return <Typography variant="h6">Access Denied</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Hantera Nyhetsinlägg
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setModalOpen(true)} sx={{ mb: 2 }}>
        Skapa Ny Nyhet
      </Button>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{ p: 4, bgcolor: 'background.paper', margin: 'auto', mt: 5, maxWidth: 500 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              name="title"
              label="Titel"
              value={currentPost.title}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              name="content"
              label="Innehåll"
              multiline
              rows={4}
              value={currentPost.content}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              name="pictureUrl"
              label="Bild URL"
              value={currentPost.pictureUrl}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              name="fileUrl"
              label="Fil URL"
              value={currentPost.fileUrl}
              onChange={handleInputChange}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                {isEditing ? 'Uppdatera' : 'Publicera'}
              </Button>
              <Button variant="outlined" color="primary" onClick={() => setModalOpen(false)}>
                Avbryt
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Titel</TableCell>
              <TableCell>Innehåll</TableCell>
              <TableCell>Författare</TableCell>
              <TableCell>Skapad Datum</TableCell>
              <TableCell>Ändrad Datum</TableCell>
              <TableCell>Bild URL</TableCell>
              <TableCell>Fil URL</TableCell>
              <TableCell>Åtgärder</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {newsList.map((newsItem) => (
              <TableRow key={newsItem.id}>
                <TableCell>{newsItem.title}</TableCell>
                <TableCell>{newsItem.content}</TableCell>
                <TableCell>{newsItem.authorName}</TableCell>
                <TableCell>{newsItem.dateCreated}</TableCell>
                <TableCell>{newsItem.dateModified}</TableCell>
                <TableCell>{newsItem.pictureUrl}</TableCell>
                <TableCell>{newsItem.fileUrl}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(newsItem)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(newsItem.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default NewsManagement;