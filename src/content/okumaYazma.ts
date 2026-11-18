/**
 * OKUMA YAZMA YOLU — harf harf ilk okuma yazma (MEB İlk Okuma Yazma Kitabı 1–2 akışı).
 * Her harf bir durak: hece ve kelimeler kitabın o harfte verdikleridir (docs/meb-kitaplar/analiz/turkce-1.md §1.3);
 * cümle ve metinler özgündür. Tüm öğeler yalnızca o ana kadar öğrenilmiş harflerden oluşur (testli).
 */
import { WEB_SENTENCES, WEB_WORDS } from './webBank'

export interface LetterStage {
  letter: string
  heceler: string[]
  kelimeler: string[]
  cumleler?: string[]
  metin?: { text: string; q: string; a: string; w: string[] }
}

const S = (letter: string, heceler: string, kelimeler: string, cumleler?: string[], metin?: LetterStage['metin']): LetterStage => ({
  letter,
  heceler: heceler ? heceler.split(' ') : [],
  kelimeler: kelimeler ? kelimeler.split(' ') : [],
  cumleler,
  metin,
})

export const STAGES: LetterStage[] = [
  S('a', '', ''),
  S('n', 'an na', 'ana'),
  S('e', 'en ne', 'nene nane anne ana'),
  S('t', 'at et ta te', 'at et ant tat ten anten tane Ata'),
  S('i', 'in it ni ti', 'nine ani ait tin'),
  S('l', 'al el il la le li', 'Nil nal tel Ela lale Ali ile etli alet atlet taneli aile el'),
  S('o', 'on ot ol no to lo', 'on ot nota Onat otel olta', ['Onat o otel.', 'Lale olta al.', 'Nil on nane al.', 'Ela ile Nil.']),
  S('k', 'ak ek ok ka ke ki ko', 'kek iki kekik kan Okan toka İlke Kaan keklik inek Ekin', ['Okan kek al.', 'İlke toka al.', 'Ekin iki kek al.', 'Kaan, kekik al.'], { text: 'Okan kek al. Ela kek al. Okan ile Ela iki kek al.', q: 'Okan ile Ela kaç kek aldı?', a: 'iki', w: ['on', 'tek'] }),
  S('u', 'un ut tu ku lu', 'kul oku okul Utku kutu kule kulak koku kokulu okullu kilo', ['Utku kutu al.', 'Utku un al.', 'Utku okul.', 'Kutu Utku ile Ela.'], { text: 'Utku okul. Utku kutu al. Kutu Utku ile Nil.', q: 'Utku ne aldı?', a: 'kutu', w: ['kek', 'toka'] }),
  S('r', 'ar er ir ra re ri', 'lira kara tere tarak nar erik Rana Nur Onur Eren', ['Rana nar al.', 'Eren erik al.', 'Onur tarak al.', 'Nur iki lira al.'], { text: 'Rana ile Eren. Rana nar al. Eren erik al. Nur tarak al.', q: 'Eren ne aldı?', a: 'erik', w: ['nar', 'tarak'] }),
  S('ı', 'ın ıt tı kı rı', 'tırtıl anı Anıl Tarık atkı altı tatlı Itır kulaklık', ['Anıl atkı al.', 'Tarık altı nar al.', 'Itır tatlı al.'], { text: 'Anıl atkı al. Itır tatlı al. Anıl ile Itır altı nar al.', q: 'Anıl ne aldı?', a: 'atkı', w: ['tatlı', 'nar'] }),
  S('m', 'em im ma mi mu', 'kalem armut mum kim minik elma Mete ekmek Kemal Mine marul limon lokum', ['Mine elma al.', 'Kemal limon al.', 'Mete ekmek al.', 'Mine mum al.'], { text: 'Mine marketten elma ile armut al. Mete limon al. Kemal minik kalem al.', q: 'Mete ne aldı?', a: 'limon', w: ['elma', 'kalem'] }),
  S('ü', 'ün üm tü mü', 'ünlü ütü tül Ümit tünel ülke Ülkü Atatürk', ['Ülkü ütü al.', 'Ümit tül al.', 'Ülkü minik ütü al.'], { text: 'Ülkü ile Ümit. Ülkü ütü al. Ümit tül al. Annem ütü ile tül ütüle.', q: 'Ümit ne aldı?', a: 'tül', w: ['ütü', 'kalem'] }),
  S('s', 'se si su sa', 'süt askı saat Suna soru sulu Esma simit Sinan masal susamlı', ['Suna simit al.', 'Esma süt al.', 'Sinan masal oku.', 'Saat on iki.'], { text: 'Esma süt iste. Annesi Esma ile simit al. Esma simit ile süt ister.', q: 'Esma ne istedi?', a: 'süt', w: ['saat', 'masal'] }),
  S('ö', 'ön kö ö sö', 'örnek önlem kömür tören önlük Ömer önemli örtü kök ömür', ['Ömer önlük al.', 'Ömer örnek oku.', 'Ömer önlük ister.'], { text: 'Ömer okula önlük alır. Önlük mor. Ömer önlük ile mutlu.', q: 'Ömer okula ne ile gitti?', a: 'önlük', w: ['örtü', 'kömür'] }),
  S('y', 'ya ye yo yu yü yö', 'yön sayı Öykü yol oyna Oya oyun yemek Ayla yaka', ['Oya oyun oyna.', 'Ayla yemek ye.', 'Öykü yolu sola al.'], { text: 'Oya ile Ayla oyun oynar. Ayla yorulur. Oya ile Ayla yemek yer.', q: 'Oya ile Ayla ne oynar?', a: 'oyun', w: ['yemek', 'yol'] }),
  S('d', 'ad da de dö du', 'dal dik dur dön dut kedi dere dede döner dört Dilek odun', ['Dede dut ye.', 'Dilek kedi istedi.', 'Dede odun aldı.'], { text: 'Dilek dedesi ile dereye indi. Dere kenarı dut dolu. Dede dört dut aldı.', q: 'Dede kaç dut aldı?', a: 'dört', w: ['iki', 'on'] }),
  S('z', 'az za zu zi', 'üzüm Azra tuz muz yazı Zeki kazak teyze yüzük taze zeytin', ['Zeki üzüm ye.', 'Azra muz al.', 'Teyzem kazak ördü.'], { text: 'Azra teyzesinde kaldı. Teyzesi Azra ile kazak ördü. Azra kazak ile mutlu oldu.', q: 'Teyzesi Azra için ne ördü?', a: 'kazak', w: ['yüzük', 'zeytin'] }),
  S('ç', 'aç uç ça çe çi', 'çay çim çiz maç saç taç Ayça çilek çiçek reçel Çetin reçete serçe sütlaç', ['Çetin çay iç.', 'Ayça çilek ye.', 'Ayça çiçek aldı.'], { text: 'Ayça erken kalktı. Çiçekleri suladı. Çiçeklerin üstüne serçe kondu. Serçe çok minikti. Ayça serçeyi izledi.', q: 'Çiçeklerin üstüne ne kondu?', a: 'serçe', w: ['çilek', 'reçel'] }),
  S('b', 'ab ba be bi bu', 'bir bu börek bayrak abla Ebru Burak balık baba otobüs balon', ['Burak balık tuttu.', 'Ebru balon aldı.', 'Babam börek aldı.'], { text: 'Burak babası ile denize indi. Burak bir balık tuttu. Balık çok minikti. Burak onu suya bıraktı.', q: 'Burak balığı ne yaptı?', a: 'suya bıraktı', w: ['sattı', 'yedi'] }),
  S('g', 'ga ge gi gü gö', 'gül göz gözlük Gaye gazoz gitar dergi Gamze günaydın gazete silgi karga gömlek', ['Gamze gül aldı.', 'Gaye gözlük taktı.', 'Gamze dergi okudu.'], { text: 'Gaye erken kalktı. Annesine günaydın dedi. Gözlük taktı. Sonra gazete okudu.', q: 'Gaye ne okudu?', a: 'gazete', w: ['dergi', 'gitar'] }),
  S('c', 'ca ce cü cı', 'cam cüce baca gece ocak Can eczane tencere oyuncak bilmece', ['Can cam sildi.', 'Gece oldu.', 'Can oyuncak aldı.'], { text: 'Gece oldu. Can odasına girdi. Annesi Can için bir bilmece sordu. Can bilmeceyi bildi.', q: 'Annesi Can için ne sordu?', a: 'bilmece', w: ['oyuncak', 'tencere'] }),
  S('ş', 'şi şa şe şu', 'taş beş şarkı Şule arkadaş şemsiye kuş', ['Şule şarkı söyledi.', 'Arkadaşım beş taş buldu.', 'Kuş şarkı söyledi.'], { text: 'Şule ile arkadaşı dışarıda oynadı. Bir kuş şarkı söyledi. Şule de kuşa eşlik etti.', q: 'Kim şarkı söyledi?', a: 'kuş', w: ['taş', 'şemsiye'] }),
  S('p', 'pa pe pu pi', 'pil top iplik pide paten küpe pasta Pınar portakal pırasa', ['Pınar pasta yedi.', 'Pınar top oynadı.', 'Annem pide aldı.'], { text: 'Pınar parka gitti. Parkta paten kaydı. Sonra arkadaşları ile top oynadı. Akşam yemekte pide yedi.', q: 'Pınar akşam ne yedi?', a: 'pide', w: ['pasta', 'portakal'] }),
  S('h', 'ha he hi ho', 'halı hala hırka Hülya ıhlamur hediye', ['Hasan halıya oturdu.', 'Hülya hırka giydi.', 'Halam hediye aldı.'], { text: 'Hülya hasta oldu. Halası ona ıhlamur yaptı. Hülya hırkasını giydi. Sonra ıhlamurunu içti.', q: 'Halası Hülya için ne yaptı?', a: 'ıhlamur', w: ['hırka', 'hediye'] }),
  S('v', 'av ev va ve vi', 'hava havuz kova ayva manav vişne eldiven voleybol avukat', ['Hava çok güzel.', 'Manav ayva sattı.', 'Kova havuza düştü.'], { text: 'Hava çok güzeldi. Ali ile Veli havuza gitti. Veli kovayı suyla doldurdu. Çok mutlu oldular!', q: 'Ali ile Veli nereye gitti?', a: 'havuza', w: ['manava', 'eve'] }),
  S('ğ', 'ağ öğ ğa ğı', 'dağ bağ yağ ağaç düğün Yağız yağmur poğaça kurbağa öğretmen', ['Yağmur yağdı.', 'Dağda ağaç çok.', 'Yağız poğaça yedi.'], { text: 'Yağmur yağıyordu. Yağız pencereden baktı. Bahçedeki ağacın altında bir kurbağa vardı. Kurbağa yağmurda zıplıyordu.', q: 'Ağacın altında ne vardı?', a: 'kurbağa', w: ['poğaça', 'öğretmen'] }),
  S('f', 'fa fe fi fo', 'fare kafa fidan Efe köfte Fatma defter fasulye', ['Fatma defter aldı.', 'Efe köfte yedi.', 'Fare fidanın altına girdi.'], { text: 'Efe ile Fatma bahçeye fidan dikti. Fidanı her gün suladılar. Bir gün fidanın yanında küçük bir fare gördüler.', q: 'Efe ile Fatma bahçeye ne dikti?', a: 'fidan', w: ['fasulye', 'defter'] }),
  S('j', 'ja je ju jü', 'jeton jüri baraj garaj Jale judo mesaj pijama', ['Jale pijama giydi.', 'Jale judo yaptı.', 'Garajda araba var.'], { text: 'Jale akşam pijamasını giydi. Annesine bir mesaj yazdı: İyi geceler! Sonra uyudu.', q: 'Jale akşam ne giydi?', a: 'pijama', w: ['jeton', 'garaj'] }),
]

// İnternet araştırmasından gelen kelime ve cümlelerle zenginleştir (kitap kelimeleri önce)
for (const st of STAGES) {
  const low = (x: string) => x.toLocaleLowerCase('tr-TR')
  const have = new Set(st.kelimeler.map(low))
  for (const w of WEB_WORDS[st.letter] ?? []) if (!have.has(low(w)) && w.length > 1) (have.add(low(w)), st.kelimeler.push(w))
  const sents = WEB_SENTENCES[st.letter] ?? []
  if (sents.length) st.cumleler = Array.from(new Set([...(st.cumleler ?? []), ...sents]))
}

export const stageOf = (l: string) => STAGES.find((s) => s.letter === l)!
