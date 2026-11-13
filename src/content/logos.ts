import type { Difficulty } from '@/engine/types'

export type Sector = 'tech' | 'app' | 'auto' | 'moda' | 'cibo' | 'sport' | 'media' | 'viaggi' | 'giochi' | 'altro'

export interface Logo {
  /** slug di simple-icons */
  slug: string
  name: string
  sector: Sector
  fame: Difficulty
}

type Row = [slug: string, name: string, fame: Difficulty]

const sector = (s: Sector, list: Row[]): Logo[] => list.map(([slug, name, fame]) => ({ slug, name, sector: s, fame }))

/**
 * Solo loghi fatti di simboli: quelli che mostrano il nome scritto per intero
 * (SAMSUNG, IKEA, FIAT…) renderebbero la domanda banale e sono esclusi.
 */
export const LOGOS: readonly Logo[] = [
  ...sector('app', [
    ['apple', 'Apple', 1], ['google', 'Google', 1], ['youtube', 'YouTube', 1], ['facebook', 'Facebook', 1],
    ['instagram', 'Instagram', 1], ['whatsapp', 'WhatsApp', 1], ['tiktok', 'TikTok', 1], ['x', 'X', 1],
    ['reddit', 'Reddit', 2], ['pinterest', 'Pinterest', 2], ['snapchat', 'Snapchat', 2], ['telegram', 'Telegram', 1],
    ['discord', 'Discord', 2], ['twitch', 'Twitch', 2], ['dropbox', 'Dropbox', 3], ['github', 'GitHub', 3],
    ['firefox', 'Firefox', 2], ['googlechrome', 'Google Chrome', 1], ['opera', 'Opera', 3], ['safari', 'Safari', 2],
    ['wordpress', 'WordPress', 3], ['figma', 'Figma', 3], ['duolingo', 'Duolingo', 2], ['shazam', 'Shazam', 2],
    ['soundcloud', 'SoundCloud', 3], ['applemusic', 'Apple Music', 2], ['meta', 'Meta', 2],
    ['messenger', 'Messenger', 2], ['tinder', 'Tinder', 2], ['wikipedia', 'Wikipedia', 2], ['threads', 'Threads', 3],
    ['bluesky', 'Bluesky', 3], ['vimeo', 'Vimeo', 3], ['wechat', 'WeChat', 3], ['viber', 'Viber', 3],
    ['signal', 'Signal', 3], ['spotify', 'Spotify', 1], ['netflix', 'Netflix', 1], ['googlemaps', 'Google Maps', 1],
    ['googledrive', 'Google Drive', 2], ['gmail', 'Gmail', 1], ['googlephotos', 'Google Foto', 2],
    ['icloud', 'iCloud', 2], ['appstore', 'App Store', 1], ['googleplay', 'Google Play', 1],
    ['googlemeet', 'Google Meet', 2], ['tumblr', 'Tumblr', 3], ['flickr', 'Flickr', 3], ['quora', 'Quora', 3],
    ['mastodon', 'Mastodon', 3], ['duckduckgo', 'DuckDuckGo', 3], ['strava', 'Strava', 3], ['dribbble', 'Dribbble', 3],
    ['baidu', 'Baidu', 3], ['qq', 'QQ', 3], ['tidal', 'Tidal', 3], ['audible', 'Audible', 3],
    ['crunchyroll', 'Crunchyroll', 3], ['googleassistant', 'Google Assistant', 3],
  ]),
  ...sector('tech', [
    ['android', 'Android', 1], ['playstation', 'PlayStation', 1], ['nvidia', 'NVIDIA', 2], ['huawei', 'Huawei', 2],
    ['xiaomi', 'Xiaomi', 2], ['oneplus', 'OnePlus', 3], ['motorola', 'Motorola', 2], ['bitcoin', 'Bitcoin', 1],
    ['ethereum', 'Ethereum', 2], ['linux', 'Linux', 2], ['ubuntu', 'Ubuntu', 3], ['raspberrypi', 'Raspberry Pi', 3],
    ['mcafee', 'McAfee', 3], ['blender', 'Blender', 3], ['beatsbydre', 'Beats', 3],
  ]),
  ...sector('giochi', [
    ['steam', 'Steam', 3], ['ubisoft', 'Ubisoft', 3], ['rockstargames', 'Rockstar Games', 3], ['sega', 'Sega', 3],
    ['roblox', 'Roblox', 2], ['fortnite', 'Fortnite', 2], ['valorant', 'Valorant', 3],
    ['leagueoflegends', 'League of Legends', 3],
  ]),
  ...sector('altro', [
    ['carrefour', 'Carrefour', 2], ['shell', 'Shell', 2], ['bosch', 'Bosch', 2], ['vodafone', 'Vodafone', 1],
    ['paypal', 'PayPal', 1], ['mastercard', 'Mastercard', 1], ['revolut', 'Revolut', 2], ['vinted', 'Vinted', 2],
    ['zalando', 'Zalando', 2],
  ]),
  ...sector('auto', [
    ['ferrari', 'Ferrari', 1], ['lamborghini', 'Lamborghini', 1], ['maserati', 'Maserati', 2], ['audi', 'Audi', 1],
    ['volkswagen', 'Volkswagen', 1], ['toyota', 'Toyota', 1], ['honda', 'Honda', 1], ['mazda', 'Mazda', 2],
    ['subaru', 'Subaru', 3], ['suzuki', 'Suzuki', 2], ['hyundai', 'Hyundai', 2], ['chevrolet', 'Chevrolet', 2],
    ['tesla', 'Tesla', 1], ['renault', 'Renault', 1], ['citroen', 'Citroën', 2], ['opel', 'Opel', 2],
    ['seat', 'SEAT', 2], ['skoda', 'Škoda', 3], ['dacia', 'Dacia', 3], ['rollsroyce', 'Rolls-Royce', 3],
    ['bentley', 'Bentley', 3], ['bugatti', 'Bugatti', 3], ['mitsubishi', 'Mitsubishi', 2], ['infiniti', 'Infiniti', 3],
    ['acura', 'Acura', 3], ['polestar', 'Polestar', 3],
  ]),
  ...sector('sport', [
    ['nike', 'Nike', 1], ['adidas', 'Adidas', 1], ['puma', 'Puma', 1], ['reebok', 'Reebok', 2],
    ['newbalance', 'New Balance', 2], ['underarmour', 'Under Armour', 3], ['nba', 'NBA', 2], ['jordan', 'Jordan', 2],
    ['premierleague', 'Premier League', 2], ['wwe', 'WWE', 3],
  ]),
  ...sector('cibo', [
    ['mcdonalds', "McDonald's", 1], ['starbucks', 'Starbucks', 1], ['redbull', 'Red Bull', 1],
    ['deliveroo', 'Deliveroo', 2], ['justeat', 'Just Eat', 2], ['glovo', 'Glovo', 2], ['monster', 'Monster Energy', 2],
  ]),
  ...sector('media', [['paramountplus', 'Paramount+', 3]]),
  ...sector('viaggi', [
    ['airbnb', 'Airbnb', 1], ['tripadvisor', 'Tripadvisor', 2], ['ryanair', 'Ryanair', 1], ['lufthansa', 'Lufthansa', 2],
    ['emirates', 'Emirates', 2], ['qatarairways', 'Qatar Airways', 3], ['airfrance', 'Air France', 3],
    ['britishairways', 'British Airways', 3], ['turkishairlines', 'Turkish Airlines', 3], ['boeing', 'Boeing', 2],
  ]),
]
