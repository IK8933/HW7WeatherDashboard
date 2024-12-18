import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HISTORY_FILE_PATH = path.join(__dirname, 'searchHistory.json');

class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

class HistoryService {
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(HISTORY_FILE_PATH, { encoding: 'utf8', flag: 'a+' });
      if (data.trim().length === 0) {
        return [];
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.map((c: any) => new City(c.name, c.id));
      } else if (parsed && Array.isArray(parsed.cities)) {
        return parsed.cities.map((c: any) => new City(c.name, c.id));
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }

  private async write(cities: City[]): Promise<void> {
    const data = JSON.stringify(cities, null, 2);
    await fs.writeFile(HISTORY_FILE_PATH, data, 'utf8');
  }

  public async getCities(): Promise<City[]> {
    const cities = await this.read();
    return cities;
  }

  public async addCity(cityName: string): Promise<void> {
    const cities = await this.read();
    const newCity = new City(cityName, uuidv4());
    cities.push(newCity);
    await this.write(cities);
  }

  public async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const filtered = cities.filter(city => city.id !== id);
    await this.write(filtered);
  }
}

export default new HistoryService();