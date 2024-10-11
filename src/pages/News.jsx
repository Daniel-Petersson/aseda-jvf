import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, CardActions, CardHeader, Box, Collapse, Pagination } from '@mui/material';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import { getAllNews } from '../services/NewsService';

const ITEMS_PER_PAGE = 6;

const NewsPage = () => {
  const [newsData, setNewsData] = useState([]);
  const [page, setPage] = useState(1);
  const [expandedCard, setExpandedCard] = useState(null);
  const pageCount = Math.ceil(newsData.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchNews = async () => {
      const result = await getAllNews();
      if (result.success) {
        setNewsData(result.data);
      }
    };
    fetchNews();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleExpandClick = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const paginatedNews = newsData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Container>
      <Box mt={4} mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Nyheter
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {paginatedNews.map((newsItem) => (
          <Grid item xs={12} sm={6} md={4} key={newsItem.id}>
            <Card>
              <CardHeader
                avatar={<NewspaperIcon fontSize="large" color="primary" />}
                title={newsItem.title}
              />
              {newsItem.image && (
                <CardMedia
                  component="img"
                  height="140"
                  image={newsItem.image}
                  alt={newsItem.title}
                />
              )}
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {newsItem.content}
                </Typography>
                <Collapse in={expandedCard === newsItem.id}>
                  <Typography variant="body2" color="text.secondary" mt={2}>
                    {newsItem.fullContent}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                    Författare: {newsItem.authorName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Skapad: {new Date(newsItem.dateCreated).toLocaleDateString()}
                  </Typography>
                </Collapse>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" variant="cardButton" onClick={() => handleExpandClick(newsItem.id)}>
                  {expandedCard === newsItem.id ? 'Visa mindre' : 'Läs mer'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box mt={4} mb={4} display="flex" justifyContent="center">
        <Pagination 
          count={pageCount} 
          page={page} 
          onChange={handleChangePage} 
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default NewsPage;
