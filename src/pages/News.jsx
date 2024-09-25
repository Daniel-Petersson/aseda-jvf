import React, { useState } from 'react';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, CardActions, CardHeader, Box, Pagination } from '@mui/material';
import NewspaperIcon from '@mui/icons-material/Newspaper';

const newsData = [
  {
    id: 1,
    title: 'Nytt öppettider på skjutbanan',
    description: 'Vi har uppdaterat våra öppettider för hösten. Läs mer om de nya tiderna.',
    image: '/path/to/image1.jpg',
  },
  {
    id: 2,
    title: 'Jägarexamens kurser öppnar snart',
    description: 'Anmäl dig till våra kurser för jägarexamen som startar nästa månad.',
    image: '/path/to/image2.jpg',
  },
  {
    id: 3,
    title: 'Ny viltvårdsplan antagen',
    description: 'Föreningen har antagit en ny viltvårdsplan för kommande säsong.',
    image: '/path/to/image3.jpg',
  },
  {
    id: 4,
    title: 'Resultat från årets älgjakt',
    description: 'Se statistik och bilder från årets framgångsrika älgjakt.',
    image: '/path/to/image4.jpg',
  },
  {
    id: 5,
    title: 'Upprustning av klubbstugan',
    description: 'Vi söker frivilliga för att hjälpa till med renovering av klubbstugan.',
    image: '/path/to/image5.jpg',
  },
  {
    id: 6,
    title: 'Ny utrustning till skjutbanan',
    description: 'Föreningen har investerat i ny modern utrustning till skjutbanan.',
    image: '/path/to/image6.jpg',
  },
  {
    id: 7,
    title: 'Föreläsning om vildsvinsjakt',
    description: 'Missa inte vår gästföreläsare som talar om effektiv vildsvinsjakt.',
    image: '/path/to/image7.jpg',
  },
  {
    id: 8,
    title: 'Ungdomsläger i sommar',
    description: 'Anmälan är nu öppen för sommarens populära ungdomsläger.',
    image: '/path/to/image8.jpg',
  },
  {
    id: 9,
    title: 'Ny jakthund i föreningen',
    description: 'Möt vår nya tränade jakthund som kommer att assistera under jakter.',
    image: '/path/to/image9.jpg',
  },
  {
    id: 10,
    title: 'Säkerhetskurs för jägare',
    description: 'Vi erbjuder en obligatorisk säkerhetskurs för alla aktiva jägare.',
    image: '/path/to/image10.jpg',
  },
  {
    id: 11,
    title: 'Årsmöte nästa månad',
    description: 'Glöm inte att anmäla dig till föreningens årsmöte den 15:e.',
    image: '/path/to/image11.jpg',
  },
  {
    id: 12,
    title: 'Ny app för medlemmar',
    description: 'Ladda ner vår nya app för att få senaste nytt och boka tider.',
    image: '/path/to/image12.jpg',
  },
  {
    id: 13,
    title: 'Fototävling - Djur i naturen',
    description: 'Delta i vår fototävling och vinn fina priser. Tema: Djur i naturen.',
    image: '/path/to/image13.jpg',
  },
  {
    id: 14,
    title: 'Samarbete med grannföreningen',
    description: 'Vi har inlett ett nytt samarbete med grannföreningen för bättre viltvård.',
    image: '/path/to/image14.jpg',
  },
  {
    id: 15,
    title: 'Ny ordförande vald',
    description: 'På extramötet valdes Karin Svensson till ny ordförande för föreningen.',
    image: '/path/to/image15.jpg',
  },
  {
    id: 16,
    title: 'Vinterjakt - Säkerhetstips',
    description: 'Läs våra viktiga säkerhetstips inför vinterns jakter i snöiga förhållanden.',
    image: '/path/to/image16.jpg',
  }
];

const ITEMS_PER_PAGE = 6;

const NewsPage = () => {
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(newsData.length / ITEMS_PER_PAGE);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
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
              <CardMedia
                component="img"
                height="140"
                image={newsItem.image}
                alt={newsItem.title}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {newsItem.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" variant="cardButton" href={`/news/${newsItem.id}`}>
                  Läs mer
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
