import React, { useState } from 'react';
import { Container, Grid, Card, CardContent, CardActions, Button, Typography, Stepper, Step, StepLabel, Collapse, Box, CardHeader } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import QuizIcon from '@mui/icons-material/Quiz';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../styles/Theme';

const steps = ['Förberedelser & Utbildning', 'Teoriprovet', 'Praktiska Provet - Kulgevär', 'Praktiska Provet - Hagelgevär', 'Högviltprov', 'Vad kostar det?'];

const JagarExamen = () => {
  const [expandedCard, setExpandedCard] = useState(null);

  const handleExpandClick = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
          <Stepper activeStep={-1} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Grid container spacing={4} mt={4}>
            {/* Card 1: Förberedelser & Utbildning */}
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardHeader
                  avatar={<SchoolIcon fontSize="large" color="primary" />}
                  title="Förberedelser & Utbildning"
                />
                <CardContent>
                  <Typography variant="body2">
                    Förbered dig med rätt utbildning och material för att klara jägarexamen.
                  </Typography>
                  <Collapse in={expandedCard === 0}>
                    <Typography variant="body2" style={{ marginTop: '10px' }}>
                      Det är viktigt att ha en god förståelse för jaktlagar, säkerhet och viltvård.
                    </Typography>
                  </Collapse>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" variant="cardButton" onClick={() => handleExpandClick(0)}>
                    {expandedCard === 0 ? 'Visa mindre' : 'Läs mer'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            {/* Card 2: Teoriprovet */}
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardHeader
                  avatar={<QuizIcon fontSize="large" color="primary" />}
                  title="Teoriprovet"
                />
                <CardContent>
                  <Typography variant="body2">
                    Förbered dig för teoriprovet med rätt material och tips.
                  </Typography>
                  <Collapse in={expandedCard === 1}>
                    <Typography variant="body2" style={{ marginTop: '10px' }}>
                      Du behöver ett passfoto, ID-kort eller körkort samt 500 kronor (betalas via Swish) för att genomföra teoriprovet.
                    </Typography>
                  </Collapse>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" variant="cardButton" onClick={() => handleExpandClick(1)}>
                    {expandedCard === 1 ? 'Visa mindre' : 'Läs mer'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            {/* Card 3: Praktiska Provet - Kulgevär */}
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardHeader
                  avatar={<GpsFixedIcon fontSize="large" color="primary" />}
                  title="Praktiska Provet - Kulgevär"
                />
                <CardContent>
                  <Typography variant="body2">
                    Testa din förmåga att hantera kulgevär och precisionsskjutning.
                  </Typography>
                  <Collapse in={expandedCard === 2}>
                    <Typography variant="body2" style={{ marginTop: '10px' }}>
                      Provtagarens vapenhantering och träffsäkerhet bedöms noggrant. Säker kulgevärshantering är ett viktigt moment och precisionsskjutning sker på 80 meters avstånd.
                    </Typography>
                  </Collapse>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" variant="cardButton" onClick={() => handleExpandClick(2)}>
                    {expandedCard === 2 ? 'Visa mindre' : 'Läs mer'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            {/* Card 4: Praktiska Provet - Hagelgevär */}
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardHeader
                  avatar={<RemoveRedEyeIcon fontSize="large" color="primary" />}
                  title="Praktiska Provet - Hagelgevär"
                />
                <CardContent>
                  <Typography variant="body2">
                    Testa din förmåga att hantera hagelgevär, avståndsbedömning och skjutning mot markmål.
                  </Typography>
                  <Collapse in={expandedCard === 3}>
                    <Typography variant="body2" style={{ marginTop: '10px' }}>
                      Förmågan att bedöma avstånd, träffa lerduvor och markmål prövas. Minst fyra av sex lerduvor måste träffas och avståndsbedömningen måste vara korrekt.
                    </Typography>
                  </Collapse>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" variant="cardButton" onClick={() => handleExpandClick(3)}>
                    {expandedCard === 3 ? 'Visa mindre' : 'Läs mer'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            {/* Card 5: Högviltprov */}
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardHeader
                  avatar={<GpsFixedIcon fontSize="large" color="primary" />}
                  title="Högviltprov"
                />
                <CardContent>
                  <Typography variant="body2">
                    Klarar du älgskytteprovet genom att skjuta mot både stillastående och löpande älgfigurer.
                  </Typography>
                  <Collapse in={expandedCard === 4}>
                    <Typography variant="body2" style={{ marginTop: '10px' }}>
                      Skjutserier med fyra skott måste träffa rätt på älgfigurerna, både stillastående och i rörelse. Tre av nio serier måste godkännas.
                    </Typography>
                  </Collapse>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" variant="cardButton" onClick={() => handleExpandClick(4)}>
                    {expandedCard === 4 ? 'Visa mindre' : 'Läs mer'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            {/* Card 6: Vad kostar det? */}
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardHeader
                  avatar={<AttachMoneyIcon fontSize="large" color="primary" />}
                  title="Vad kostar det?"
                />
                <CardContent>
                  <Typography variant="body2">
                    Få en överblick över kostnaderna för att ta jägarexamen.
                  </Typography>
                  <Collapse in={expandedCard === 5}>
                    <Typography variant="body2" style={{ marginTop: '10px' }}>
                      <ul>
                        <li>Teoretiskt Prov: 500 kr</li>
                        <li>Grundprov Kulgevär: 200 kr</li>
                        <li>Praktiskt högviltprov: 200-300 kr</li>
                        <li>Hagelgevärsprov: 400 kr</li>
                        <li>Omprov av ett underkänt moment: 100 kr</li>
                        <li>Ammunitionskostnad: 350–1000 kr</li>
                      </ul>
                    </Typography>
                  </Collapse>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" variant="cardButton" onClick={() => handleExpandClick(5)}>
                    {expandedCard === 5 ? 'Visa mindre' : 'Läs mer'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default JagarExamen;