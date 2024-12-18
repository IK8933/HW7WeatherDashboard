import { Router, Request, Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js'; 
import dayjs from 'dayjs';

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { city } = req.body;

  if (!city || typeof city !== 'string') {
    res.status(400).json({ error: 'Valid city name is required.' });
    return; // return nothing (void)
  }

  try {
    const weatherData = await WeatherService.getWeatherForCity(city);
    await HistoryService.addCity(city);
    res.status(200).json({
      message: `Weather data for ${city}`,
      data: weatherData,
    });
    return; // return nothing (void)
  } catch (error: any) {
    console.error(`Error in POST /weather: ${error.message}`);
    res.status(500).json({ error: `Error retrieving weather data: ${error.message}` });
    return; // return nothing (void)
  }
});

router.get('/history', async (_req: Request, res: Response) => {
  try {
    const date = dayjs
    console.log(date)
    const savedCities = await HistoryService.getCities();
    res.status(200).json(savedCities);
  } catch (error: any) {
    console.error(`Error in GET /weather/history: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve search history.' });
  }
});

router.delete('/history/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: 'City ID is required.' });
    return;
  }

  try {
    await HistoryService.removeCity(id);
    res.status(200).json({ message: 'City successfully removed from search history.' });
    return;
  } catch (error: any) {
    console.error(`Error in DELETE /weather/history/${id}: ${error.message}`);
    res.status(500).json({ error: 'Failed to remove city from search history.' });
    return;
  }
});

export default router;