import React, { useState, useEffect } from "react";
import API from "./services/api";
import {
  Calendar,
  MapPin,
  Ticket,
  Shield,
  Search,
  Plus,
  ArrowRight,
  Disc,
  Bell,
  QrCode,
  LayoutDashboard,
  LogOut,
  Check,
  Users,
  DollarSign,
  Settings,
  BarChart2,
  Layers,
  Archive,
  FileText,
  CreditCard,
  ChevronRight,
  Activity,
  Speaker,
  Zap,
  Trash2,
  Heart,
  Star,
  Filter,
} from "lucide-react";

interface EventItem {
  id: string;
  title: string;
  description?: string;
  date?: string;
  venue?: string;
  category?:
    | "Konser"
    | "Tiyatro"
    | "Stand-Up"
    | "Festival"
    | "Workshop"
    | "Sergi";
  price?: number;
  image?: string;
  status?: "upcoming" | "completed";
  soundSystem?: string;
  lighting?: string;
  gates?: string[];
  accessibility?: string;
  powerSupply?: string;
  stageSize?: string;
  capacity?: string;
  favoritesCount?: number;
  avgRating?: number;
  reviews?: Array<{ user: string; rating: number; comment: string }>;
}

interface UserTicket {
  id: string;
  eventTitle: string;
  venue: string;
  date: string;
  seat: string;
  count: number;
  totalPrice: number;
  ticketType: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    | "landing"
    | "login"
    | "explore"
    | "detail"
    | "checkout"
    | "my-tickets"
    | "admin"
  >("landing");
  const [userRole, setUserRole] = useState<"user" | "admin">("user");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const [activeAdmin, setActiveAdmin] = useState<
    "Esranur Aygün" | "Eren İşitmez"
  >("Esranur Aygün");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Arama & Filtreleme State'leri
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const [filterVenue, setFilterVenue] = useState<string>("Tümü");
  const [filterPriceMax, setFilterPriceMax] = useState<number>(1000);

  const [favorites, setFavorites] = useState<string[]>([]);
  const [userRating, setUserRating] = useState<number>(5);
  const [userComment, setUserComment] = useState("");

  const [ticketCount, setTicketCount] = useState<number>(1);
  const [selectedSeat, setSelectedSeat] = useState<string>("VIP Koltuk - A1");
  const [ticketType, setTicketType] = useState<"Tam" | "Öğrenci" | "VIP">(
    "Tam",
  );
  const [attendeeName, setAttendeeName] = useState("");
  const [attendeeEmail, setAttendeeEmail] = useState("");
  const [attendeePhone, setAttendeePhone] = useState("");

  const [myTicketsList, setMyTicketsList] = useState<UserTicket[]>([
    {
      id: "TKT-8842",
      eventTitle: "Duman Konseri: Akustik Turne",
      venue: "Zorlu PSM Turkcell Sahnesi",
      date: "2026-06-14",
      seat: "VIP Blok - A1",
      count: 1,
      totalPrice: 550,
      ticketType: "Tam",
    },
  ]);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [adminTab, setAdminTab] = useState<
    | "events"
    | "new-event"
    | "sales"
    | "gate"
    | "venue"
    | "reports"
    | "notifications"
    | "settings"
  >("events");
  const [salesSubView, setSalesSubView] = useState<
    "overview" | "revenue-by-event" | "tickets-by-event"
  >("overview");

  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Yeni Etkinlik Onayı",
      desc: "Mabel Matiz konseri bilet satışları hedefi aştı.",
      time: "10 dk önce",
    },
    {
      id: "2",
      title: "Sistem Raporu",
      desc: "Haftalık ciro analizi başarıyla güncellendi.",
      time: "1 saat önce",
    },
    {
      id: "3",
      title: "Kapı Yoğunluğu Uyarısı",
      desc: "Ana turnikelerde anlık yoğunluk normale döndü.",
      time: "3 saat önce",
    },
  ]);

  const [gateLogs, setGateLogs] = useState<
    Array<{
      id: string;
      time: string;
      attendee: string;
      event: string;
      gate: string;
      status: string;
    }>
  >([
    {
      id: "LOG-9942",
      time: "21:12:45",
      attendee: "Merve Korkmaz",
      event: "Duman Konseri",
      gate: "Turnike A1 (Ana Kapı)",
      status: "Giriş Onaylandı",
    },
    {
      id: "LOG-9941",
      time: "21:11:20",
      attendee: "Burak Serdar",
      event: "Duman Konseri",
      gate: "Turnike V1 (VIP Kapı)",
      status: "Giriş Onaylandı",
    },
    {
      id: "LOG-9940",
      time: "21:09:12",
      attendee: "Gizem Aydın",
      event: "Mor ve Ötesi Senfonik",
      gate: "Turnike K1 (Kuzey)",
      status: "Giriş Onaylandı",
    },
    {
      id: "LOG-9937",
      time: "21:02:14",
      attendee: "Esranur Aygün",
      event: "Duman Konseri",
      gate: "Turnike A1 (Ana Kapı)",
      status: "Giriş Onaylandı",
    },
    {
      id: "LOG-9936",
      time: "20:59:50",
      attendee: "Eren İşitmez",
      event: "Teoman Konseri",
      gate: "Turnike V1 (VIP Kapı)",
      status: "Giriş Onaylandı",
    },
  ]);

  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventVenue, setNewEventVenue] = useState("");
  const [newEventPrice, setNewEventPrice] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventCategory, setNewEventCategory] = useState<
    "Konser" | "Tiyatro" | "Stand-Up" | "Festival" | "Workshop" | "Sergi"
  >("Konser");
  const [newEventDesc, setNewEventDesc] = useState("");
  const [newEventImage, setNewEventImage] = useState("");
  const [newEventStatus, setNewEventStatus] = useState<
    "upcoming" | "completed"
  >("upcoming");

  const [sliderIndex, setSliderIndex] = useState(0);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const initialEvents: EventItem[] = [
    {
      id: "1",
      title: "Duman Konseri: Akustik Turne",
      venue: "Zorlu PSM Turkcell Sahnesi",
      category: "Konser",
      price: 550,
      date: "2026-06-14",
      status: "completed",
      image:
        "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=800&q=80",
      description:
        "Türk rock müziğinin efsane grubu Duman, en sevilen akustik şarkılarıyla unutulmaz bir gece yaşatıyor.",
      soundSystem: "Meyer Sound LEO Line Array (Ana Konsol: DiGiCo SD7)",
      lighting: "120x Moving Head Beam, Robe Esprite & Martin MAC Aura LEDWash",
      gates: [
        "Ana Giriş Kapısı (A1)",
        "VIP Özel Giriş (V1)",
        "Acil Tahliye Kapısı (Kuzey Koridor)",
        "Engelli ve Basın Girişi (E1)",
      ],
      accessibility:
        "Tekerlekli sandalye rampaları, özel asansör ve işaret dili tercüman alanı.",
      powerSupply:
        "Jeneratör destekli kesintisiz 250kW şebeke ve UPS altyapısı.",
      stageSize:
        "Genişlik: 18m, Derinlik: 12m, Yükseklik: 1.8m (Büyük Sahne Mimarisi)",
      capacity: "2,300 Kişi",
      favoritesCount: 34,
      avgRating: 4.8,
      reviews: [
        {
          user: "Ahmet Y.",
          rating: 5,
          comment: "Muazzam bir akustik geceydi!",
        },
      ],
    },
    {
      id: "2",
      title: "Mor ve Ötesi Senfonik Konser",
      venue: "Harbiye Cemil Topuzlu Açıkhava",
      category: "Konser",
      price: 750,
      date: "2026-07-20",
      status: "upcoming",
      image:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
      description:
        "Senfoni orkestrası eşliğinde unutulmaz Mor ve Ötesi şarkıları açık havada müzikseverlerle buluşuyor.",
      soundSystem: "L-Acoustics K2 System (Senfoni Mikrofonlandırma Seti)",
      lighting: "Full Spektrum Sahne Boyama, Robe MegaPointe ve SİS Efektleri",
      gates: ["Vadi Giriş Kapısı (A)", "Rampa Kapı (B)", "Protokol Kapısı (P)"],
      accessibility:
        "Özel VIP engelli tribünleri, rehber köpek alanları ve otopark.",
      powerSupply: "Çift jeneratör yedekli 300kW ana güç kaynağı.",
      stageSize:
        "Genişlik: 22m, Derinlik: 14m, Yükseklik: 2.0m (Geniş Amfi Sahne)",
      capacity: "4,800 Kişi",
      favoritesCount: 52,
      avgRating: 4.9,
      reviews: [
        {
          user: "Zeynep K.",
          rating: 5,
          comment: "Senfoni ile rock harmanlanmış, muhteşem!",
        },
      ],
    },
    {
      id: "3",
      title: "Cem Yılmaz: Diamond Elite Platinum Plus",
      venue: "Tim Show Center",
      category: "Stand-Up",
      price: 900,
      date: "2026-08-15",
      status: "upcoming",
      image:
        "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=800&q=80",
      description:
        "Türkiye’nin en sevilen komedyeni Cem Yılmaz, kahkaha dolu yeni gösterisiyle sahnede.",
      soundSystem: "Tiyatro Optimizasyonlu Profesyonel Ses Altyapısı",
      lighting: "Stand-up Özel Takip Spotları ve Sahne Yıkama Işıkları",
      gates: ["Maslak Ana Fuaye Girişi", "VIP Salon Kapısı", "Acil Çıkış"],
      accessibility: "Engelli misafirler için zemin kat rezerve alanları.",
      powerSupply: "150kW jeneratör desteği.",
      stageSize: "Genişlik: 12m, Derinlik: 8m, Yükseklik: 1.0m",
      capacity: "1,700 Kişi",
      favoritesCount: 45,
      avgRating: 4.7,
      reviews: [],
    },
    {
      id: "4",
      title: "Shakespeare: Hamlet Tiyatro Oyunu",
      venue: "Harbiye Muhsin Ertuğrul Sahnesi",
      category: "Tiyatro",
      price: 400,
      date: "2026-09-10",
      status: "upcoming",
      image:
        "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=800&q=80",
      description:
        "Klasik tiyatro eserinin modern uyarlaması ile büyüleyici bir sahne sanatları akşamı.",
      soundSystem: "Tiyatro Akustik Yönlü Mikrofon Sistemi",
      lighting: "Dramatik Sahne Gölgelendirmeleri ve Spot Kontrol",
      gates: ["Ana Tiyatro Girişi", "Sanatçı Kapısı"],
      accessibility: "Tam engelli uyumlu salon ve asansör.",
      powerSupply: "120kW şebeke.",
      stageSize: "Genişlik: 14m, Derinlik: 10m",
      capacity: "900 Kişi",
      favoritesCount: 19,
      avgRating: 4.6,
      reviews: [],
    },
    {
      id: "5",
      title: "Istanbul Coffee Festival & Akustik",
      venue: "KüçükÇiftlik Park",
      category: "Festival",
      price: 350,
      date: "2026-10-05",
      status: "upcoming",
      image:
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",
      description:
        "Nitelikli kahve atölyeleri, tadımlar ve gün boyu süren açık hava konserleri.",
      soundSystem: "Festival Alanı Dağıtımlı Line Array",
      lighting: "Gün ışığı ve LED Atölye Aydınlatmaları",
      gates: ["Mete Cad. Ana Giriş", "Otopark Kapısı", "Acil Çıkış"],
      accessibility: "Geniş yürüyüş yolları ve engelli tuvaletleri.",
      powerSupply: "300kW mobil jeneratör tırı.",
      stageSize: "Genişlik: 16m, Derinlik: 10m",
      capacity: "5,000 Kişi",
      favoritesCount: 28,
      avgRating: 4.5,
      reviews: [],
    },
    {
      id: "6",
      title: "Teoman: Bozuldu Yeminler Turnesi",
      venue: "KüçükÇiftlik Park",
      category: "Konser",
      price: 600,
      date: "2026-08-20",
      status: "upcoming",
      image:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
      description:
        "Rock müziğin asi kalemi Teoman, en sevilen klasiklerini dev kadrosuyla seslendiriyor.",
      soundSystem: "d&b audiotechnik KSL Series Line Array",
      lighting: "Konser Lazer Gösterisi, 80x RGB Wash",
      gates: ["Ana Kapı", "VIP Kapı"],
      accessibility: "Özel engelli platformları.",
      powerSupply: "200kW sistem.",
      stageSize: "Genişlik: 16m, Derinlik: 10m",
      capacity: "5,000 Kişi",
      favoritesCount: 39,
      avgRating: 4.8,
      reviews: [],
    },
    {
      id: "7",
      title: "Mabel Matiz Canlı Performans",
      venue: "Maximum Uniq Hall",
      category: "Konser",
      price: 650,
      date: "2026-09-05",
      status: "upcoming",
      image:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
      description:
        "Eşsiz vokali, renkli sahne kostümleri ve hit şarkılarıyla Mabel Matiz müzik ziyafeti sunuyor.",
      soundSystem: "Meyer Sound Lina Compact Line Array",
      lighting: "LED Bar Matrisleri, Takip Işıkları",
      gates: ["Maslak Ana Giriş", "Plaza VIP Kapı"],
      accessibility: "Asansörlü salon geçişi.",
      powerSupply: "180kW kesintisiz güç.",
      stageSize: "Genişlik: 14m, Derinlik: 9m",
      capacity: "1,800 Kişi",
      favoritesCount: 41,
      avgRating: 4.9,
      reviews: [],
    },
    {
      id: "8",
      title: "Sertab Erener: Her Zaman Sen",
      venue: "Volkswagen Arena",
      category: "Konser",
      price: 700,
      date: "2026-10-12",
      status: "upcoming",
      image:
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
      description:
        "Güçlü sesi ve dünden bugüne hit olan şarkılarıyla muazzam bir sahne performansı.",
      soundSystem: "L-Acoustics K3 Arena Ses Sistemi",
      lighting: "360 Derece Sahne Aydınlatması",
      gates: ["Arena Ana Giriş", "VIP Salon Kapısı"],
      accessibility: "Tam engelli uyumlu zemin.",
      powerSupply: "350kW endüstriyel jeneratör.",
      stageSize: "Genişlik: 20m, Derinlik: 16m",
      capacity: "6,000 Kişi",
      favoritesCount: 60,
      avgRating: 5.0,
      reviews: [],
    },
    {
      id: "9",
      title: "Kenan Doğulu Yaz Konseri",
      venue: "İzmir Bornova Açıkhava",
      category: "Konser",
      price: 680,
      date: "2026-06-28",
      status: "completed",
      image:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
      description:
        "Enerjisi hiç düşmeyen sahne şovları ve pop müziğin en popüler şarkıları.",
      soundSystem: "JBL VTX V25 Line Array",
      lighting: "Renkli Lazerler ve Sis Jeneratörleri",
      gates: ["Bornova Gişe Kapısı", "VIP Giriş"],
      accessibility: "Engelli dostu rampalar.",
      powerSupply: "220kW jeneratör.",
      stageSize: "Genişlik: 17m, Derinlik: 11m",
      capacity: "3,500 Kişi",
      favoritesCount: 31,
      avgRating: 4.7,
      reviews: [],
    },
    {
      id: "10",
      title: "Pentagram: Akustik & Elektrik",
      venue: "IF Performance Hall Beşiktaş",
      category: "Konser",
      price: 450,
      date: "2026-11-04",
      status: "upcoming",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80",
      description:
        "Türk heavy metal efsanesi Pentagram, akustik ve elektrik setleriyle sahnede.",
      soundSystem: "EV X-Line Advanced Concert Sound",
      lighting: "Agresif Metal Konser Işıklandırması",
      gates: ["Beşiktaş Cad. Giriş"],
      accessibility: "Salon içi düz ayak erişim.",
      powerSupply: "160kW kombine jeneratör.",
      stageSize: "Genişlik: 12m, Derinlik: 8m",
      capacity: "1,200 Kişi",
      favoritesCount: 22,
      avgRating: 4.6,
      reviews: [],
    },
    {
      id: "11",
      title: "Yaratıcı Drama & Tiyatro Atölyesi",
      venue: "Moda Sahnesi İstanbul",
      category: "Workshop",
      price: 250,
      date: "2026-06-30",
      status: "upcoming",
      image:
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      description:
        "Profesyonel tiyatrocular eşliğinde uygulamalı sahne ve drama workshop programı.",
      soundSystem: "Stüdyo Konferans Ses Sistemi",
      lighting: "Eğitim Odası LED Işıkları",
      gates: ["Moda Cad. Ana Giriş"],
      accessibility: "Engelli katılımcılara tam uyumlu atölye salonu.",
      powerSupply: "90kW şebeke.",
      stageSize: "Genişlik: 8m, Derinlik: 6m",
      capacity: "80 Kişi",
      favoritesCount: 15,
      avgRating: 4.8,
      reviews: [],
    },
    {
      id: "12",
      title: "Dijital Sanat ve NFT Sergisi",
      venue: "Galata Rum Okulu Sanat Merkezi",
      category: "Sergi",
      price: 200,
      date: "2026-07-15",
      status: "upcoming",
      image:
        "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=800&q=80",
      description:
        "Türkiye’nin önde gelen dijital sanatçılarının eserlerinden oluşan etkileyici sergi.",
      soundSystem: "Ambient Kulaklık ve Akustik Ses Dağılımı",
      lighting: "Özel Sergi Spotları ve Projeksiyon Duvarları",
      gates: ["Galata Giriş Kapısı"],
      accessibility: "Tarihi bina asansör ve rampa entegrasyonu.",
      powerSupply: "150kW jeneratör.",
      stageSize: "Galata Sergi Salonu Kompleksi",
      capacity: "1,000 Kişi",
      favoritesCount: 20,
      avgRating: 4.4,
      reviews: [],
    },
    {
      id: "13",
      title: "Yüzyüzeyken Konuşuruz Akustik",
      venue: "Babylon Bomonti",
      category: "Konser",
      price: 500,
      date: "2026-08-01",
      status: "upcoming",
      image:
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
      description:
        "Alternatif rock müziğin sevilen grubu Yüzyüzeyken Konuşuruz, samimi akustik setiyle Babylon sahnesinde.",
      soundSystem: "L-Acoustics ARCS WiC System",
      lighting: "Vintage Sahne Lambaları ve Amber Işıklar",
      gates: ["Bomonti Ana Giriş Kapısı"],
      accessibility: "Engelli asansörü mevcut.",
      powerSupply: "180kW jeneratör.",
      stageSize: "Genişlik: 12m, Derinlik: 8m",
      capacity: "600 Kişi",
      favoritesCount: 48,
      avgRating: 4.9,
      reviews: [],
    },
    {
      id: "14",
      title: "Uluslararası Caz Festivali Galası",
      venue: "Cemal Reşit Rey Konser Salonu",
      category: "Festival",
      price: 800,
      date: "2026-11-20",
      status: "upcoming",
      image:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
      description:
        "Dünyaca ünlü caz sanatçılarının katılımıyla unutulmaz bir gala gecesi.",
      soundSystem: "Meyer Sound Ultra-X40 Audiophile System",
      lighting: "Klasik Konser Sahne Aydınlatması",
      gates: ["Harbiye CRR Fuaye Girişi"],
      accessibility: "Tam engelli rampalı salon.",
      powerSupply: "220kW şebeke.",
      stageSize: "Genişlik: 18m, Derinlik: 12m",
      capacity: "850 Kişi",
      favoritesCount: 36,
      avgRating: 5.0,
      reviews: [],
    },
  ];

  useEffect(() => {
    setEvents(initialEvents);
    setSelectedEvent(initialEvents[0]);
    setLoading(false);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % Math.min(events.length, 5));
    }, 4500);
    return () => clearInterval(interval);
  }, [events]);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !newEventVenue || !newEventPrice) {
      alert("Lütfen zorunlu alanları doldurun!");
      return;
    }

    const newEntry: EventItem = {
      id: String(Date.now()),
      title: newEventTitle,
      venue: newEventVenue,
      category: newEventCategory,
      price: Number(newEventPrice),
      date: newEventDate || "2026-12-30",
      description:
        newEventDesc || "Profesyonel altyapıyla donatılmış yeni etkinlik.",
      status: newEventStatus,
      image:
        newEventImage ||
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
      soundSystem: "Profesyonel Salon Ses Sistemi",
      lighting: "Akıllı LED Aydınlatma",
      gates: ["Ana Giriş Kapısı A1"],
      accessibility: "Engelli dostu erişim",
      powerSupply: "200kW Jeneratör",
      stageSize: "Genişlik: 15m, Derinlik: 10m",
      capacity: "2,000 Kişi",
      favoritesCount: 0,
      avgRating: 5.0,
      reviews: [],
    };

    setEvents((prev) => [newEntry, ...prev]);
    alert("Yeni etkinlik sisteme başarıyla eklendi!");
    resetForm();
  };

  const resetForm = () => {
    setNewEventTitle("");
    setNewEventVenue("");
    setNewEventPrice("");
    setNewEventDate("");
    setNewEventDesc("");
    setNewEventImage("");
    setAdminTab("events");
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 15;
    const y = (clientY / window.innerHeight - 0.5) * 15;
    setMousePos({ x, y });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.toLowerCase().includes("admin")) {
      setUserRole("admin");
      setCurrentScreen("admin");
    } else {
      setUserRole("user");
      setCurrentScreen("explore");
    }
  };

  const toggleFavorite = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const isFav = favorites.includes(eventId);
          const newFavCount = isFav
            ? (ev.favoritesCount || 1) - 1
            : (ev.favoritesCount || 0) + 1;
          if (isFav) {
            setFavorites(favorites.filter((id) => id !== eventId));
          } else {
            setFavorites([...favorites, eventId]);
          }
          return { ...ev, favoritesCount: newFavCount };
        }
        return ev;
      }),
    );
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !userComment.trim()) return;

    const newReview = {
      user: "Esranur Aygün",
      rating: userRating,
      comment: userComment,
    };
    const updatedReviews = [newReview, ...(selectedEvent.reviews || [])];
    const totalScore = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
    const newAvg = Number((totalScore / updatedReviews.length).toFixed(1));

    const updatedEvent = {
      ...selectedEvent,
      reviews: updatedReviews,
      avgRating: newAvg,
    };

    setSelectedEvent(updatedEvent);
    setEvents((prev) =>
      prev.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev)),
    );
    setUserComment("");
    alert("Değerlendirmeniz ve yıldızınız sisteme başarıyla kaydedildi!");
  };

  const calculatePrice = () => {
    if (!selectedEvent) return 0;
    let base = selectedEvent.price || 500;
    if (ticketType === "Öğrenci") base = base * 0.75;
    if (ticketType === "VIP") base = base * 1.4;
    return Math.round(base * ticketCount);
  };

  const handleCompleteCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !attendeeName.trim() ||
      !attendeeEmail.trim() ||
      !attendeePhone.trim()
    ) {
      alert("Lütfen katılımcı iletişim bilgilerini eksiksiz doldurun!");
      return;
    }
    if (
      !cardName.trim() ||
      !cardNumber.trim() ||
      !cardExpiry.trim() ||
      !cardCvv.trim()
    ) {
      alert("Lütfen güvenli ödeme kart bilgilerinizi eksiksiz girin!");
      return;
    }

    const finalPrice = calculatePrice();
    const newTicket: UserTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      eventTitle: selectedEvent?.title || "Etkinlik",
      venue: selectedEvent?.venue || "Mekan",
      date: selectedEvent?.date || "2026-06-14",
      seat: selectedSeat,
      count: ticketCount,
      totalPrice: finalPrice,
      ticketType: ticketType,
    };

    setMyTicketsList((prev) => [newTicket, ...prev]);
    alert("Ödeme başarıyla alındı, biletiniz cüzdanınıza eklendi!");
    setCurrentScreen("my-tickets");
  };

  const handleCancelTicket = (ticketId: string) => {
    if (confirm("Bu bileti iptal etmek istediğinize emin misiniz?")) {
      setMyTicketsList((prev) => prev.filter((t) => t.id !== ticketId));
      alert("Bilet başarıyla iptal edildi ve iade süreci başlatıldı.");
    }
  };

  // Kategori, Arama, Fiyat ve Mekan Filtreleme Mantığı
  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "Tümü" || ev.category === selectedCategory;
    const matchesVenue = filterVenue === "Tümü" || ev.venue === filterVenue;
    const matchesPrice = (ev.price || 0) <= filterPriceMax;

    return matchesSearch && matchesCategory && matchesVenue && matchesPrice;
  });

  const uniqueVenues = [
    "Tümü",
    ...Array.from(new Set(events.map((e) => e.venue || ""))),
  ];

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#0D0914] text-[#F3EDF7] font-sans antialiased selection:bg-[#FF2E93] selection:text-white relative overflow-x-hidden"
    >
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF2E93]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[#9333EA]/15 rounded-full blur-3xl pointer-events-none" />

      {/* ---------------- 1. LANDING / TANITIM SAYFASI ---------------- */}
      {currentScreen === "landing" && (
        <div className="min-h-screen flex flex-col justify-between px-6 py-12 max-w-7xl mx-auto relative">
          <header className="flex justify-between items-center">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setCurrentScreen("landing")}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-stone-300 via-stone-100 to-stone-400 flex items-center justify-center shadow-lg shadow-stone-400/20">
                <Disc
                  className="text-[#0D0914] animate-spin"
                  size={22}
                  style={{ animationDuration: "8s" }}
                />
              </div>
              <h1 className="text-xl font-black tracking-wider bg-gradient-to-r from-white via-[#F472B6] to-[#C084FC] bg-clip-text text-transparent">
                Eventify
              </h1>
            </div>

            <button
              onClick={() => setCurrentScreen("login")}
              className="bg-gradient-to-r from-[#FF2E93] to-[#D946EF] text-white px-6 py-2.5 rounded-full text-xs font-bold transition shadow-lg shadow-[#FF2E93]/30 hover:opacity-90"
            >
              Giriş Yap / Kayıt Ol
            </button>
          </header>

          <div
            style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
            className="text-center my-12 transition-transform duration-200 ease-out flex flex-col items-center"
          >
            <h2 className="text-5xl md:text-7xl font-black tracking-tight max-w-4xl leading-tight mb-6">
              Müziğin, Sahnenin ve <br />
              <span className="bg-gradient-to-r from-[#FF2E93] via-[#E879F9] to-[#C084FC] bg-clip-text text-transparent">
                Sonsuz Eğlencenin Kalbi.
              </span>
            </h2>
            <p className="text-[#C4B5FD] text-base md:text-lg max-w-2xl mb-10">
              Türkiye'nin en seçkin konserleri, tiyatroları, festivalleri ve
              canlı performansları Eventify'da.
            </p>
            <button
              onClick={() => setCurrentScreen("login")}
              className="bg-gradient-to-r from-[#FF2E93] to-[#D946EF] text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-2xl shadow-[#FF2E93]/40 transition flex items-center gap-2 hover:scale-105"
            >
              Hemen Etkinlikleri Keşfet <ArrowRight size={18} />
            </button>
          </div>

          <div className="w-full">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#C4B5FD] mb-4 text-center">
              Öne Çıkan Konserler
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.slice(0, 3).map((ev) => (
                <div
                  key={ev.id}
                  className="bg-[#181226] border border-[#2D2342] rounded-3xl overflow-hidden shadow-2xl group hover:border-[#FF2E93] transition"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={ev.image}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />
                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-[#FF2E93] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                      {ev.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-black mt-1 mb-2 text-white">
                      {ev.title}
                    </h4>
                    <p className="text-xs text-[#C4B5FD]">{ev.venue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <footer className="mt-12 text-center text-xs text-stone-500 border-t border-[#2D2342] pt-6">
            © 2026 Eventify. Tüm hakları saklıdır.
          </footer>
        </div>
      )}

      {/* ---------------- 2. GİRİŞ YAP EKRANI ---------------- */}
      {currentScreen === "login" && (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-md w-full bg-[#181226] border border-[#3E2F5B] rounded-3xl p-8 shadow-2xl relative">
            <button
              onClick={() => setCurrentScreen("landing")}
              className="text-xs text-[#C4B5FD] hover:text-white mb-6 block"
            >
              ← Ana Sayfaya Dön
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-stone-300 to-stone-400 flex items-center justify-center">
                <Disc className="text-[#0D0914] animate-spin" size={16} />
              </div>
              <h2 className="text-2xl font-black text-white">Eventify Giriş</h2>
            </div>
            <p className="text-xs text-[#C4B5FD] mb-6"></p>

            <form
              onSubmit={handleLoginSubmit}
              className="space-y-4"
              autoComplete="off"
            >
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#C4B5FD] mb-1">
                  E-posta Adresi
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@eventify.com"
                  className="w-full bg-[#110D1D] border border-[#3E2F5B] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF2E93]"
                  required
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#C4B5FD] mb-1">
                  Şifre
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#110D1D] border border-[#3E2F5B] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF2E93]"
                  required
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FF2E93] to-[#D946EF] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-[#FF2E93]/30 transition hover:opacity-90"
              >
                Giriş Yap ve Devam Et
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- 3. KULLANICI KEŞİF EKRANI (Kategori Filtreleme & Detaylı Filtre Paneli Eklendi) ---------------- */}
      {currentScreen === "explore" && (
        <div className="min-h-screen">
          <header className="bg-[#181226]/80 backdrop-blur-md border-b border-[#2D2342] px-6 md:px-12 py-4 flex justify-between items-center sticky top-0 z-50">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setCurrentScreen("landing")}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-stone-300 to-stone-400 flex items-center justify-center">
                <Disc className="text-[#0D0914] animate-spin" size={18} />
              </div>
              <h1 className="text-lg font-black text-white">Eventify</h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentScreen("my-tickets")}
                className="text-xs font-bold text-[#C4B5FD] hover:text-white bg-[#251B37] px-4 py-2 rounded-xl border border-[#3E2F5B] flex items-center gap-1.5"
              >
                <Ticket size={14} className="text-[#FF2E93]" /> Biletlerim
              </button>
              <button
                onClick={() => setCurrentScreen("landing")}
                className="text-xs font-bold text-stone-400 hover:text-white flex items-center gap-1"
              >
                <LogOut size={14} /> Çıkış
              </button>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-6 py-10">
            {events.length > 0 && (
              <div className="w-full bg-gradient-to-r from-[#1E1430] to-[#2B1B48] border border-[#3E2F5B] rounded-3xl p-8 md:p-12 mb-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="relative z-10 max-w-xl">
                  <span className="bg-[#FF2E93]/20 text-[#FF2E93] border border-[#FF2E93]/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {events[sliderIndex]?.category || "Öne Çıkan"}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black mt-3 mb-3 text-white">
                    {events[sliderIndex]?.title}
                  </h2>
                  <p className="text-xs md:text-sm text-[#C4B5FD] mb-6">
                    {events[sliderIndex]?.description}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedEvent(events[sliderIndex]);
                      setCurrentScreen("detail");
                    }}
                    className="bg-gradient-to-r from-[#FF2E93] to-[#D946EF] text-white px-6 py-3 rounded-xl font-bold text-xs shadow-lg shadow-[#FF2E93]/30 flex items-center gap-2 hover:scale-105 transition"
                  >
                    Etkinliği İncele ve Bilet Al <ChevronRight size={16} />
                  </button>
                </div>
                <div className="w-full md:w-80 h-48 rounded-2xl overflow-hidden border border-[#3E2F5B] relative shadow-2xl">
                  <img
                    src={events[sliderIndex]?.image}
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Arama Alanı */}
            <div className="mb-6">
              <div className="relative max-w-3xl mx-auto">
                <Search
                  className="absolute left-4 top-3.5 text-[#C4B5FD]"
                  size={20}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Etkinlik, mekan, sanatçı veya kategori arayın..."
                  className="w-full bg-[#181226] border border-[#3E2F5B] rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#FF2E93] shadow-xl"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Kategori Seçenekleri Çubuğu */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6 max-w-4xl mx-auto justify-center">
              {[
                "Tümü",
                "Konser",
                "Tiyatro",
                "Stand-Up",
                "Festival",
                "Workshop",
                "Sergi",
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${selectedCategory === cat ? "bg-[#FF2E93] text-white shadow-lg shadow-[#FF2E93]/30" : "bg-[#181226] text-[#C4B5FD] border border-[#3E2F5B] hover:border-[#FF2E93]"}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Tarih, Fiyat ve Mekan Belirleme / Filtreleme Paneli */}
            <div className="bg-[#181226] border border-[#3E2F5B] p-6 rounded-3xl mb-10 shadow-xl max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#C4B5FD] mb-2 flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#FF2E93]" /> Mekan / Salon
                  Seçimi
                </label>
                <select
                  value={filterVenue}
                  onChange={(e) => setFilterVenue(e.target.value)}
                  className="w-full bg-[#110D1D] border border-[#3E2F5B] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF2E93]"
                >
                  {uniqueVenues.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#C4B5FD] mb-2 flex items-center gap-1.5">
                  <Filter size={14} className="text-[#FF2E93]" /> Maksimum Fiyat
                  Sınırı:{" "}
                  <span className="text-white font-mono font-bold">
                    ₺{filterPriceMax}
                  </span>
                </label>
                <input
                  type="range"
                  min="200"
                  max="1000"
                  step="50"
                  value={filterPriceMax}
                  onChange={(e) => setFilterPriceMax(Number(e.target.value))}
                  className="w-full accent-[#FF2E93] bg-[#110D1D] cursor-pointer"
                />
              </div>
            </div>

            <h3 className="text-2xl font-black mb-6 text-white">
              Etkinlikler ve Konserler ({filteredEvents.length})
            </h3>

            {loading ? (
              <p className="text-stone-400">Yükleniyor...</p>
            ) : filteredEvents.length === 0 ? (
              <div className="bg-[#181226] border border-[#3E2F5B] p-12 rounded-3xl text-center text-stone-400">
                Seçtiğiniz filtreleme kriterlerine uygun etkinlik bulunamadı.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredEvents.map((event) => {
                  const isFav = favorites.includes(event.id);
                  return (
                    <div
                      key={event.id}
                      onClick={() => {
                        setSelectedEvent(event);
                        setCurrentScreen("detail");
                      }}
                      className="bg-[#181226] border border-[#2D2342] hover:border-[#FF2E93] rounded-3xl overflow-hidden shadow-xl cursor-pointer transition flex flex-col justify-between group relative"
                    >
                      <div className="h-44 overflow-hidden relative">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-[#FF2E93] border border-[#FF2E93]/30 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                          {event.category || "Konser"}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(event.id);
                          }}
                          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${isFav ? "bg-[#FF2E93] text-white" : "bg-black/60 text-stone-300 hover:text-white"}`}
                        >
                          <Heart size={16} fill={isFav ? "white" : "none"} />
                        </button>
                      </div>
                      <div className="p-5">
                        <h4 className="text-base font-black mb-1.5 text-white group-hover:text-[#FF2E93] transition line-clamp-1">
                          {event.title}
                        </h4>
                        <p className="text-[11px] text-[#C4B5FD] line-clamp-1 mb-4">
                          {event.venue}
                        </p>

                        <div className="border-t border-[#2D2342] pt-3 flex justify-between items-center text-xs">
                          <span className="text-[#C4B5FD]">{event.date}</span>
                          <span className="font-mono font-bold text-white">
                            ₺{event.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      )}

      {/* ---------------- 4. ETKİNLİK DETAY EKRANI ---------------- */}
      {currentScreen === "detail" && selectedEvent && (
        <div className="max-w-4xl mx-auto px-6 py-12">
          <button
            onClick={() => setCurrentScreen("explore")}
            className="text-xs font-bold text-[#C4B5FD] hover:text-white mb-6 block"
          >
            ← Keşfet'e Dön
          </button>

          <div className="bg-[#181226] border border-[#3E2F5B] rounded-3xl overflow-hidden shadow-2xl space-y-8 pb-10">
            <div className="h-72 relative">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181226] via-transparent to-transparent" />

              <button
                onClick={() => toggleFavorite(selectedEvent.id)}
                className={`absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur-md text-xs font-bold transition shadow-xl ${favorites.includes(selectedEvent.id) ? "bg-[#FF2E93] text-white" : "bg-black/60 text-white hover:bg-black/80"}`}
              >
                <Heart
                  size={16}
                  fill={favorites.includes(selectedEvent.id) ? "white" : "none"}
                />
                {favorites.includes(selectedEvent.id)
                  ? "Favorilerde"
                  : "Favorilere Ekle"}
              </button>
            </div>

            <div className="px-8 md:px-12 space-y-6">
              <div>
                <div className="flex justify-between items-center">
                  <span className="bg-[#FF2E93]/10 text-[#FF2E93] border border-[#FF2E93]/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                    {selectedEvent.category} • {selectedEvent.venue}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                    <Star size={14} fill="currentColor" />{" "}
                    {selectedEvent.avgRating || 5.0} Puan (
                    {selectedEvent.reviews?.length || 0} Değerlendirme)
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4 text-white">
                  {selectedEvent.title}
                </h2>
                <p className="text-sm text-[#C4B5FD] leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#110D1D] p-6 rounded-2xl border border-[#3E2F5B] text-xs text-[#C4B5FD]">
                <p>
                  <strong className="text-white">Tarih:</strong>{" "}
                  {selectedEvent.date}
                </p>
                <p>
                  <strong className="text-white">Altyapı / Ses:</strong>{" "}
                  {selectedEvent.soundSystem}
                </p>
                <p>
                  <strong className="text-white">Sahne Ölçüsü:</strong>{" "}
                  {selectedEvent.stageSize}
                </p>
                <p>
                  <strong className="text-white">Kapasite:</strong>{" "}
                  {selectedEvent.capacity}
                </p>
              </div>

              <button
                onClick={() => setCurrentScreen("checkout")}
                className="w-full bg-gradient-to-r from-[#FF2E93] to-[#D946EF] text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-[#FF2E93]/30 transition hover:opacity-90"
              >
                Hemen Bilet Al (₺{selectedEvent.price})
              </button>

              <div className="border-t border-[#2D2342] pt-8 space-y-6">
                <h3 className="text-lg font-bold text-white">
                  Etkinliği Değerlendir ve Yıldız Ver
                </h3>
                <form
                  onSubmit={handleAddReview}
                  className="bg-[#110D1D] p-6 rounded-2xl border border-[#3E2F5B] space-y-4"
                >
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#C4B5FD] mb-2">
                      Puanınız (Maksimum 5 Yıldız)
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setUserRating(star)}
                          className={`p-2 rounded-xl transition ${userRating >= star ? "text-amber-400 bg-amber-400/10" : "text-stone-600 bg-stone-800"}`}
                        >
                          <Star
                            size={20}
                            fill={userRating >= star ? "currentColor" : "none"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#C4B5FD] mb-1">
                      Yorumunuz
                    </label>
                    <textarea
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      placeholder="Etkinlik hakkındaki düşüncelerinizi yazın..."
                      required
                      rows={3}
                      className="w-full bg-[#181226] border border-[#3E2F5B] rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#FF2E93]"
                      autoComplete="off"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#FF2E93] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-[#FF2E93]/30"
                  >
                    Değerlendirmeyi Gönder
                  </button>
                </form>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#C4B5FD]">
                    Kullanıcı Yorumları ({selectedEvent.reviews?.length || 0})
                  </h4>
                  {selectedEvent.reviews && selectedEvent.reviews.length > 0 ? (
                    selectedEvent.reviews.map((rev, idx) => (
                      <div
                        key={idx}
                        className="bg-[#110D1D] p-4 rounded-xl border border-[#2D2342] text-xs space-y-1"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white">
                            {rev.user}
                          </span>
                          <div className="flex text-amber-400">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} size={12} fill="currentColor" />
                            ))}
                          </div>
                        </div>
                        <p className="text-[#C4B5FD]">{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-stone-500">
                      Henüz yorum yapılmamış.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 5. KOLTUK VE ÖDEME (Checkout) ---------------- */}
      {currentScreen === "checkout" && selectedEvent && (
        <div className="max-w-3xl mx-auto px-6 py-12">
          <button
            onClick={() => setCurrentScreen("detail")}
            className="text-xs font-bold text-[#C4B5FD] hover:text-white mb-6 block"
          >
            ← Detaya Dön
          </button>

          <form
            onSubmit={handleCompleteCheckout}
            className="bg-[#181226] border border-[#3E2F5B] rounded-3xl p-8 shadow-2xl space-y-6"
            autoComplete="off"
          >
            <h2 className="text-2xl font-black text-white">
              Bilet ve Ödeme Bilgileri
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#C4B5FD] mb-1">
                  Bilet Türü
                </label>
                <select
                  value={ticketType}
                  onChange={(e: any) => setTicketType(e.target.value)}
                  className="w-full bg-[#110D1D] border border-[#3E2F5B] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF2E93]"
                >
                  <option value="Tam">Tam Bilet</option>
                  <option value="Öğrenci">Öğrenci (%25 İndirimli)</option>
                  <option value="VIP">VIP (Özel İkramlı)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#C4B5FD] mb-1">
                  Kişi / Adet
                </label>
                <select
                  value={ticketCount}
                  onChange={(e) => setTicketCount(Number(e.target.value))}
                  className="w-full bg-[#110D1D] border border-[#3E2F5B] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF2E93]"
                >
                  <option value={1}>1 Kişi</option>
                  <option value={2}>2 Kişi</option>
                  <option value={3}>3 Kişi</option>
                  <option value={4}>4 Kişi</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#C4B5FD] mb-1">
                  Koltuk / Blok
                </label>
                <select
                  value={selectedSeat}
                  onChange={(e) => setSelectedSeat(e.target.value)}
                  className="w-full bg-[#110D1D] border border-[#3E2F5B] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF2E93]"
                >
                  <option>VIP Blok - A1 (Ön Sıra)</option>
                  <option>Sol Balkon - B4 (Engelli Dostu)</option>
                  <option>Sağ Tribün - C12 (Genel)</option>
                </select>
              </div>
            </div>

            <div className="border-t border-[#2D2342] pt-4 space-y-4">
              <h3 className="text-sm font-bold text-white">
                Katılımcı İletişim Bilgileri
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Ad Soyad"
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  required
                  autoComplete="off"
                  className="bg-[#110D1D] border border-[#3E2F5B] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF2E93]"
                />
                <input
                  type="email"
                  placeholder="E-posta Adresi"
                  value={attendeeEmail}
                  onChange={(e) => setAttendeeEmail(e.target.value)}
                  required
                  autoComplete="off"
                  className="bg-[#110D1D] border border-[#3E2F5B] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF2E93]"
                />
                <input
                  type="text"
                  placeholder="Telefon Numarası"
                  value={attendeePhone}
                  onChange={(e) => setAttendeePhone(e.target.value)}
                  required
                  autoComplete="off"
                  className="bg-[#110D1D] border border-[#3E2F5B] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF2E93]"
                />
              </div>
            </div>

            <div className="border-t border-[#2D2342] pt-4 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard size={16} className="text-[#FF2E93]" /> Güvenli
                Ödeme
              </h3>
              <input
                type="text"
                placeholder="Kart Üzerindeki İsim"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
                autoComplete="off"
                className="w-full bg-[#110D1D] border border-[#3E2F5B] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF2E93]"
              />
              <input
                type="text"
                placeholder="Kart Numarası (4242 •••• •••• ••••)"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
                autoComplete="off"
                className="w-full bg-[#110D1D] border border-[#3E2F5B] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF2E93]"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="AA / YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  required
                  autoComplete="off"
                  className="bg-[#110D1D] border border-[#3E2F5B] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF2E93]"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  required
                  autoComplete="off"
                  className="bg-[#110D1D] border border-[#3E2F5B] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF2E93]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#FF2E93] to-[#D946EF] text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-[#FF2E93]/30 transition hover:opacity-90 mt-4"
            >
              Ödemeyi Tamamla ve Bileti Al (₺{calculatePrice()})
            </button>
          </form>
        </div>
      )}

      {/* ---------------- 6. BİLETLERİM & İPTAL İŞLEMİ ---------------- */}
      {currentScreen === "my-tickets" && (
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setCurrentScreen("explore")}
              className="text-xs font-bold text-[#C4B5FD] hover:text-white"
            >
              ← Keşfet'e Dön
            </button>
            <button
              onClick={() => setCurrentScreen("landing")}
              className="text-xs font-bold text-[#FF2E93] hover:underline"
            >
              Ana Sayfaya Dön
            </button>
          </div>

          <h2 className="text-3xl font-black mb-2">
            Biletlerim & İptal Yönetimi
          </h2>
          <p className="text-xs text-[#C4B5FD] mb-8">
            Aktif dijital biletleriniz, QR kodlarınız ve bilet iptal
            işlemleriniz
          </p>

          <div className="space-y-6">
            {myTicketsList.length === 0 ? (
              <div className="bg-[#181226] border border-[#3E2F5B] p-12 rounded-3xl text-center text-stone-400">
                Hiç biletiniz bulunmuyor. Keşfet sayfasından etkinlik
                seçebilirsiniz.
              </div>
            ) : (
              myTicketsList.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-[#181226] border border-[#3E2F5B] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl"
                >
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="bg-[#FF2E93]/10 text-[#FF2E93] border border-[#FF2E93]/30 text-[10px] font-bold px-3 py-1 rounded-full">
                        {ticket.ticketType} Bilet
                      </span>
                      <span className="bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[10px] font-bold px-3 py-1 rounded-full">
                        ID: {ticket.id}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-white">
                      {ticket.eventTitle}
                    </h3>
                    <p className="text-xs text-[#C4B5FD]">
                      {ticket.venue} • Tarih: {ticket.date}
                    </p>
                    <div className="text-xs text-stone-300 space-y-1 pt-2">
                      <p>
                        Koltuk:{" "}
                        <strong className="text-white">{ticket.seat}</strong>
                      </p>
                      <p>
                        Adet:{" "}
                        <strong className="text-white">
                          {ticket.count} Kişi
                        </strong>
                      </p>
                      <p>
                        Ödenen Tutar:{" "}
                        <strong className="text-white font-mono">
                          ₺{ticket.totalPrice}
                        </strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <div className="bg-[#110D1D] p-4 rounded-2xl border border-[#3E2F5B] flex flex-col items-center">
                      <QrCode size={70} className="text-[#FF2E93]" />
                      <span className="text-[9px] font-mono text-[#C4B5FD] mt-1">
                        Turnike QR
                      </span>
                    </div>
                    <button
                      onClick={() => handleCancelTicket(ticket.id)}
                      className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-xl hover:bg-red-500 hover:text-white transition flex items-center gap-1.5"
                    >
                      <Trash2 size={14} /> Bileti İptal Et ve İade Al
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ---------------- 7. PROFESYONEL ADMIN PANELİ ---------------- */}
      {currentScreen === "admin" && (
        <div className="min-h-screen flex flex-col md:flex-row">
          <aside className="w-full md:w-72 bg-[#120D1D] border-r border-[#2D2342] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-stone-300 to-stone-400 flex items-center justify-center">
                  <Disc className="text-[#0D0914] animate-spin" size={16} />
                </div>
                <div>
                  <h1 className="text-sm font-black text-white">
                    Eventify Yönetim
                  </h1>
                  <span className="text-[10px] text-[#FF2E93]">
                    Admin Paneli
                  </span>
                </div>
              </div>

              <nav className="space-y-1 text-xs font-medium">
                <button
                  onClick={() => setAdminTab("events")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${adminTab === "events" ? "bg-[#FF2E93] text-white font-bold" : "text-[#C4B5FD] hover:bg-[#1C152B]"}`}
                >
                  <Calendar size={16} /> Etkinlik Yönetimi
                </button>
                <button
                  onClick={() => setAdminTab("new-event")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${adminTab === "new-event" ? "bg-[#FF2E93] text-white font-bold" : "text-[#C4B5FD] hover:bg-[#1C152B]"}`}
                >
                  <Plus size={16} /> Yeni Etkinlik Ekle
                </button>
                <button
                  onClick={() => setAdminTab("sales")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${adminTab === "sales" ? "bg-[#FF2E93] text-white font-bold" : "text-[#C4B5FD] hover:bg-[#1C152B]"}`}
                >
                  <BarChart2 size={16} /> Satışlar & Gelirler Analizi
                </button>
                <button
                  onClick={() => setAdminTab("gate")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${adminTab === "gate" ? "bg-[#FF2E93] text-white font-bold" : "text-[#C4B5FD] hover:bg-[#1C152B]"}`}
                >
                  <QrCode size={16} /> Kapı Turnike & Log Akışı
                </button>
                <button
                  onClick={() => setAdminTab("venue")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${adminTab === "venue" ? "bg-[#FF2E93] text-white font-bold" : "text-[#C4B5FD] hover:bg-[#1C152B]"}`}
                >
                  <MapPin size={16} /> Mekan & Koltuk Denetimi
                </button>
                <button
                  onClick={() => setAdminTab("reports")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${adminTab === "reports" ? "bg-[#FF2E93] text-white font-bold" : "text-[#C4B5FD] hover:bg-[#1C152B]"}`}
                >
                  <Layers size={16} /> Rapor ve İstatistikler
                </button>
                <button
                  onClick={() => setAdminTab("notifications")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${adminTab === "notifications" ? "bg-[#FF2E93] text-white font-bold" : "text-[#C4B5FD] hover:bg-[#1C152B]"}`}
                >
                  <Bell size={16} /> ({notifications.length})
                </button>
              </nav>
            </div>

            <div className="pt-6 border-t border-[#2D2342]">
              <button
                onClick={() => setCurrentScreen("explore")}
                className="w-full bg-[#1C152B] hover:bg-[#251C38] text-xs font-bold text-white py-2.5 rounded-xl border border-[#3E2F5B] transition"
              >
                Kullanıcı Moduna Geç
              </button>
            </div>
          </aside>

          <main className="flex-1 p-8 md:p-12 overflow-y-auto">
            <header className="flex justify-between items-center mb-8 border-b border-[#2D2342] pb-4">
              <div>
                <h2 className="text-xl font-black text-white">
                  Admin Kontrol Paneli
                </h2>
                <p className="text-[11px] text-[#C4B5FD]">
                  Çift Yönetici Modu: Esranur Aygün & Eren İşitmez
                </p>
              </div>

              <div className="flex items-center gap-4 relative">
                <div className="flex bg-[#181226] border border-[#3E2F5B] rounded-2xl p-1">
                  <button
                    onClick={() => setActiveAdmin("Esranur Aygün")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeAdmin === "Esranur Aygün" ? "bg-[#FF2E93] text-white" : "text-[#C4B5FD]"}`}
                  >
                    Esranur Aygün
                  </button>
                  <button
                    onClick={() => setActiveAdmin("Eren İşitmez")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeAdmin === "Eren İşitmez" ? "bg-[#FF2E93] text-white" : "text-[#C4B5FD]"}`}
                  >
                    Eren İşitmez
                  </button>
                </div>

                <div className="relative">
                  <div
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-3 bg-[#181226] border border-[#3E2F5B] px-4 py-2 rounded-2xl cursor-pointer hover:border-[#FF2E93] transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#FF2E93] flex items-center justify-center font-bold text-white text-xs">
                      {activeAdmin === "Esranur Aygün" ? "EA" : "Eİ"}
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-white">{activeAdmin}</p>
                      <span className="text-[10px] text-[#FF2E93]">
                        Admin Yetkilisi
                      </span>
                    </div>
                  </div>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#181226] border border-[#3E2F5B] rounded-2xl shadow-2xl p-2 z-50">
                      <button
                        onClick={() => setCurrentScreen("landing")}
                        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition text-left"
                      >
                        <LogOut size={14} /> Çıkış Yap (Admin Modu)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* 1. ETKİNLİK YÖNETİMİ */}
            {adminTab === "events" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black mb-2 text-white">
                    Etkinlik Yönetimi
                  </h2>
                  <p className="text-xs text-[#C4B5FD]">
                    Toplam {events.length} adet kayıtlı etkinlik, favori
                    sayıları ve değerlendirmeler.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.map((ev) => (
                    <div
                      key={ev.id}
                      className="bg-[#181226] border border-[#2D2342] p-5 rounded-2xl flex flex-col justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={ev.image}
                          alt=""
                          className="w-14 h-14 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-white">
                            {ev.title}
                          </h4>
                          <span className="text-[10px] text-[#C4B5FD]">
                            {ev.category} • {ev.venue} • ₺{ev.price}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-[#FF2E93] flex items-center gap-1 justify-end">
                            <Heart size={12} fill="currentColor" />{" "}
                            {ev.favoritesCount || 0}
                          </span>
                          <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1 justify-end mt-1">
                            <Star size={12} fill="currentColor" />{" "}
                            {ev.avgRating || 5.0}
                          </span>
                        </div>
                      </div>
                      <div className="text-[11px] text-[#C4B5FD] border-t border-[#2D2342] pt-2 flex justify-between">
                        <span>Tarih: {ev.date}</span>
                        <button
                          onClick={() => {
                            setSelectedEvent(ev);
                            setAdminTab("venue");
                          }}
                          className="text-[#FF2E93] hover:underline font-bold"
                        >
                          Mekan Planı & Teknik Detay →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. YENİ ETKİNLİK EKLE */}
            {adminTab === "new-event" && (
              <div>
                <h2 className="text-2xl font-black mb-2 text-white">
                  Yeni Etkinlik Ekle
                </h2>
                <p className="text-xs text-[#C4B5FD] mb-6">
                  Konser, Tiyatro, Stand-Up, Festival, Workshop veya Sergi
                  oluşturun.
                </p>
                <form
                  onSubmit={handleCreateEvent}
                  className="bg-[#181226] border border-[#3E2F5B] p-8 rounded-3xl space-y-4 max-w-2xl"
                  autoComplete="off"
                >
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#C4B5FD] mb-1">
                      Etkinlik Adı
                    </label>
                    <input
                      type="text"
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      placeholder="Örn: Alice Müzikali"
                      required
                      className="w-full bg-[#110D1D] border border-[#3E2F5B] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF2E93]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#C4B5FD] mb-1">
                        Kategori
                      </label>
                      <select
                        value={newEventCategory}
                        onChange={(e: any) =>
                          setNewEventCategory(e.target.value)
                        }
                        className="w-full bg-[#110D1D] border border-[#3E2F5B] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF2E93]"
                      >
                        <option value="Konser">Konser</option>
                        <option value="Tiyatro">Tiyatro</option>
                        <option value="Stand-Up">Stand-Up</option>
                        <option value="Festival">Festival</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Sergi">Sergi</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#C4B5FD] mb-1">
                        Mekan Bilgisi
                      </label>
                      <input
                        type="text"
                        value={newEventVenue}
                        onChange={(e) => setNewEventVenue(e.target.value)}
                        placeholder="Zorlu PSM"
                        required
                        className="w-full bg-[#110D1D] border border-[#3E2F5B] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF2E93]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#C4B5FD] mb-1">
                        Başlangıç Fiyatı (₺)
                      </label>
                      <input
                        type="number"
                        value={newEventPrice}
                        onChange={(e) => setNewEventPrice(e.target.value)}
                        placeholder="500"
                        required
                        className="w-full bg-[#110D1D] border border-[#3E2F5B] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF2E93]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#C4B5FD] mb-1">
                        Tarih
                      </label>
                      <input
                        type="date"
                        value={newEventDate}
                        onChange={(e) => setNewEventDate(e.target.value)}
                        className="w-full bg-[#110D1D] border border-[#3E2F5B] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF2E93]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#C4B5FD] mb-1">
                      Açıklama
                    </label>
                    <input
                      type="text"
                      value={newEventDesc}
                      onChange={(e) => setNewEventDesc(e.target.value)}
                      placeholder="Etkinlik kısa açıklaması..."
                      className="w-full bg-[#110D1D] border border-[#3E2F5B] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF2E93]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#FF2E93] text-white py-3.5 rounded-xl font-bold text-xs shadow-lg shadow-[#FF2E93]/30"
                  >
                    Etkinliği Sisteme Kaydet ve Yayınla
                  </button>
                </form>
              </div>
            )}

            {/* 3. SATIŞLAR & GELİRLER */}
            {adminTab === "sales" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black mb-2 text-white">
                    Satışlar ve Gelirler Analizi
                  </h2>
                  <p className="text-xs text-[#C4B5FD]">
                    Hangi etkinlikten ne kadar ciro elde edildiğini detaylı
                    inceleyin.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSalesSubView("overview")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${salesSubView === "overview" ? "bg-[#FF2E93] text-white" : "bg-[#181226] text-[#C4B5FD] border border-[#3E2F5B]"}`}
                  >
                    Genel Özet
                  </button>
                  <button
                    onClick={() => setSalesSubView("revenue-by-event")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${salesSubView === "revenue-by-event" ? "bg-[#FF2E93] text-white" : "bg-[#181226] text-[#C4B5FD] border border-[#3E2F5B]"}`}
                  >
                    Ciro Dağılımı
                  </button>
                  <button
                    onClick={() => setSalesSubView("tickets-by-event")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${salesSubView === "tickets-by-event" ? "bg-[#FF2E93] text-white" : "bg-[#181226] text-[#C4B5FD] border border-[#3E2F5B]"}`}
                  >
                    Bilet Dağılımı
                  </button>
                </div>

                {salesSubView === "overview" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      onClick={() => setSalesSubView("revenue-by-event")}
                      className="bg-[#181226] border border-[#2D2342] hover:border-[#FF2E93] p-6 rounded-3xl cursor-pointer transition"
                    >
                      <span className="text-xs text-[#C4B5FD]">
                        Toplam Ciro
                      </span>
                      <h3 className="text-3xl font-black text-white mt-1">
                        ₺3,450,000
                      </h3>
                    </div>
                    <div
                      onClick={() => setSalesSubView("tickets-by-event")}
                      className="bg-[#181226] border border-[#2D2342] hover:border-[#FF2E93] p-6 rounded-3xl cursor-pointer transition"
                    >
                      <span className="text-xs text-[#C4B5FD]">
                        Toplam Satılan Bilet
                      </span>
                      <h3 className="text-3xl font-black text-white mt-1">
                        7,120 Adet
                      </h3>
                    </div>
                  </div>
                )}

                {salesSubView === "revenue-by-event" && (
                  <div className="bg-[#181226] border border-[#3E2F5B] p-6 rounded-3xl space-y-4">
                    <h3 className="text-sm font-bold text-white mb-2">
                      Etkinlik Bazlı Ciro Dağılımı
                    </h3>
                    {events.map((ev, idx) => (
                      <div
                        key={ev.id}
                        className="flex justify-between items-center bg-[#110D1D] p-4 rounded-xl border border-[#2D2342] text-xs"
                      >
                        <span className="font-bold text-white">{ev.title}</span>
                        <span className="font-mono text-[#FF2E93] font-bold">
                          ₺{(idx + 4) * 65000}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {salesSubView === "tickets-by-event" && (
                  <div className="bg-[#181226] border border-[#3E2F5B] p-6 rounded-3xl space-y-4">
                    <h3 className="text-sm font-bold text-white mb-2">
                      Etkinlik Bazlı Satılan Biletler
                    </h3>
                    {events.map((ev, idx) => (
                      <div
                        key={ev.id}
                        className="flex justify-between items-center bg-[#110D1D] p-4 rounded-xl border border-[#2D2342] text-xs"
                      >
                        <span className="font-bold text-white">{ev.title}</span>
                        <span className="font-mono text-emerald-400 font-bold">
                          {(idx + 3) * 65} Adet
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. KAPI TURNİKE & CANLI LOG AKIŞI */}
            {adminTab === "gate" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black mb-2 text-white">
                    Kapı Turnike & Canlı Log Akışı
                  </h2>
                  <p className="text-xs text-[#C4B5FD]">
                    Tüm etkinlik kapılarından anlık giriş yapan, çıkış yapan
                    veya geçersiz bilet okutan kişilerin kontrol paneli.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div className="bg-[#181226] border border-[#2D2342] p-4 rounded-2xl">
                    <span className="text-[10px] text-[#C4B5FD]">
                      Turnike A1
                    </span>
                    <h4 className="font-bold text-white mt-1">
                      Ana Kapı (Aktif)
                    </h4>
                    <span className="text-emerald-400 font-mono mt-2 block">
                      2,420 Giriş Onaylı
                    </span>
                  </div>
                  <div className="bg-[#181226] border border-[#2D2342] p-4 rounded-2xl">
                    <span className="text-[10px] text-[#C4B5FD]">
                      Turnike V1
                    </span>
                    <h4 className="font-bold text-white mt-1">
                      VIP Kapı (Aktif)
                    </h4>
                    <span className="text-emerald-400 font-mono mt-2 block">
                      890 Giriş Onaylı
                    </span>
                  </div>
                  <div className="bg-[#181226] border border-[#2D2342] p-4 rounded-2xl">
                    <span className="text-[10px] text-[#C4B5FD]">
                      Turnike K1
                    </span>
                    <h4 className="font-bold text-white mt-1">
                      Kuzey Kapı (Aktif)
                    </h4>
                    <span className="text-emerald-400 font-mono mt-2 block">
                      1,150 Giriş Onaylı
                    </span>
                  </div>
                  <div className="bg-[#181226] border border-[#2D2342] p-4 rounded-2xl">
                    <span className="text-[10px] text-[#C4B5FD]">
                      Güvenlik / Red
                    </span>
                    <h4 className="font-bold text-white mt-1">
                      Geçersiz Deneme
                    </h4>
                    <span className="text-red-400 font-mono mt-2 block">
                      14 Reddedildi
                    </span>
                  </div>
                </div>

                <div className="bg-[#181226] border border-[#3E2F5B] p-6 rounded-3xl space-y-4">
                  <h3 className="text-sm font-bold text-white">
                    Canlı Turnike Log Akışı (Kim Girdi / Kim Alınmadı)
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {gateLogs.map((log) => (
                      <div
                        key={log.id}
                        className="bg-[#110D1D] border border-[#2D2342] p-3 rounded-xl flex justify-between items-center text-xs font-mono"
                      >
                        <span className="text-[#FF2E93]">{log.time}</span>
                        <span className="text-white font-bold">
                          {log.attendee}
                        </span>
                        <span className="text-[#C4B5FD]">{log.event}</span>
                        <span className="text-purple-300">{log.gate}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.status.includes("Onay") ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"}`}
                        >
                          {log.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. MEKAN & KOLTUK DENETİMİ */}
            {adminTab === "venue" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black mb-2 text-white">
                    Mekan & Koltuk Denetim Paneli
                  </h2>
                  <p className="text-xs text-[#C4B5FD]">
                    Seçili konsere özel detaylı ses sistemi, ışık, kapılar, güç
                    kaynağı ve görsel koltuk blok yerleşim şeması.
                  </p>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                  {events.map((ev) => (
                    <button
                      key={ev.id}
                      onClick={() => setSelectedEvent(ev)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${selectedEvent?.id === ev.id ? "bg-[#FF2E93] text-white" : "bg-[#181226] text-[#C4B5FD] border border-[#3E2F5B]"}`}
                    >
                      {ev.title}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div className="bg-[#181226] border border-[#2D2342] p-4 rounded-2xl space-y-1">
                    <span className="text-[#C4B5FD] font-bold flex items-center gap-1">
                      <Speaker size={14} className="text-[#FF2E93]" /> Ses
                      Sistemi
                    </span>
                    <p className="text-white">{selectedEvent?.soundSystem}</p>
                  </div>
                  <div className="bg-[#181226] border border-[#2D2342] p-4 rounded-2xl space-y-1">
                    <span className="text-[#C4B5FD] font-bold flex items-center gap-1">
                      <Zap size={14} className="text-[#FF2E93]" /> Işık & Görsel
                    </span>
                    <p className="text-white">{selectedEvent?.lighting}</p>
                  </div>
                  <div className="bg-[#181226] border border-[#2D2342] p-4 rounded-2xl space-y-1">
                    <span className="text-[#C4B5FD] font-bold flex items-center gap-1">
                      <MapPin size={14} className="text-[#FF2E93]" /> Kapılar &
                      Tahliye
                    </span>
                    <p className="text-white">
                      {selectedEvent?.gates?.join(" • ")}
                    </p>
                  </div>
                  <div className="bg-[#181226] border border-[#2D2342] p-4 rounded-2xl space-y-1">
                    <span className="text-[#C4B5FD] font-bold">
                      Erişilebilirlik
                    </span>
                    <p className="text-white">{selectedEvent?.accessibility}</p>
                  </div>
                  <div className="bg-[#181226] border border-[#2D2342] p-4 rounded-2xl space-y-1">
                    <span className="text-[#C4B5FD] font-bold">
                      Güç Kaynağı
                    </span>
                    <p className="text-white">{selectedEvent?.powerSupply}</p>
                  </div>
                  <div className="bg-[#181226] border border-[#2D2342] p-4 rounded-2xl space-y-1">
                    <span className="text-[#C4B5FD] font-bold">
                      Sahne & Kapasite
                    </span>
                    <p className="text-white">
                      {selectedEvent?.stageSize} | {selectedEvent?.capacity}
                    </p>
                  </div>
                </div>

                <div className="bg-[#181226] border border-[#3E2F5B] p-8 rounded-3xl space-y-6">
                  <div className="w-full bg-gradient-to-r from-[#FF2E93] via-[#D946EF] to-[#9333EA] py-3 rounded-2xl text-center font-bold text-sm text-white tracking-widest uppercase shadow-xl shadow-[#FF2E93]/20">
                    --- {selectedEvent?.title} Sahne Yerleşimi ---
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#110D1D] border border-[#3E2F5B] p-5 rounded-2xl space-y-3">
                      <h4 className="text-xs font-bold text-[#FF2E93] uppercase tracking-wider">
                        VIP Ön Sıra Blokları
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        {["A1", "A2", "A3", "A4"].map((s) => (
                          <div
                            key={s}
                            className="bg-emerald-500/20 border border-emerald-500/40 h-8 rounded-lg flex items-center justify-center text-[10px] font-mono text-emerald-400 font-bold"
                          >
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-[#110D1D] border border-[#3E2F5B] p-5 rounded-2xl space-y-3">
                      <h4 className="text-xs font-bold text-[#FF2E93] uppercase tracking-wider">
                        Sol / Sağ Balkon Blokları
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        {["B1", "B2", "B3", "B4"].map((s) => (
                          <div
                            key={s}
                            className="bg-purple-500/20 border border-purple-500/40 h-8 rounded-lg flex items-center justify-center text-[10px] font-mono text-purple-300 font-bold"
                          >
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-[#110D1D] border border-[#3E2F5B] p-5 rounded-2xl space-y-3">
                      <h4 className="text-xs font-bold text-[#FF2E93] uppercase tracking-wider">
                        Engelli Uyumlu Özel Alanlar
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {["EN-1", "EN-2"].map((s) => (
                          <div
                            key={s}
                            className="bg-blue-500/20 border border-blue-500/40 h-8 rounded-lg flex items-center justify-center text-[10px] font-mono text-blue-300 font-bold"
                          >
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. RAPOR VE İSTATİSTİKLER */}
            {adminTab === "reports" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black mb-2 text-white">
                    Rapor ve İstatistikler (Canlı Diyagram Ekranı)
                  </h2>
                  <p className="text-xs text-[#C4B5FD]">
                    Etkinliklerin doluluk yüzdeleri, analitik grafikler ve
                    performans diyagramları.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-[#181226] border border-[#2D2342] p-5 rounded-2xl">
                    <span className="text-[#C4B5FD]">Ortalama Doluluk</span>
                    <h3 className="text-2xl font-black text-white mt-1">
                      %94.5
                    </h3>
                    <span className="text-emerald-400 font-bold mt-2 block">
                      ↑ Yüksek Talep Trendi
                    </span>
                  </div>
                  <div className="bg-[#181226] border border-[#2D2342] p-5 rounded-2xl">
                    <span className="text-[#C4B5FD]">Toplam Etkinlik</span>
                    <h3 className="text-2xl font-black text-white mt-1">
                      14 Organizasyon
                    </h3>
                    <span className="text-[#FF2E93] font-bold mt-2 block">
                      Tam Senkronize
                    </span>
                  </div>
                  <div className="bg-[#181226] border border-[#2D2342] p-5 rounded-2xl">
                    <span className="text-[#C4B5FD]">Toplam Ziyaretçi</span>
                    <h3 className="text-2xl font-black text-white mt-1">
                      24,850 Kişi
                    </h3>
                    <span className="text-purple-300 font-bold mt-2 block">
                      Rekor Katılım
                    </span>
                  </div>
                </div>

                <div className="bg-[#181226] border border-[#3E2F5B] p-8 rounded-3xl space-y-6">
                  <h3 className="text-sm font-bold text-white">
                    Detaylı Doluluk ve İstatistik Diyagramları
                  </h3>
                  {events.map((ev, i) => {
                    const percentage = (i + 4) * 6 > 98 ? 98 : (i + 4) * 6;
                    return (
                      <div key={ev.id} className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="font-bold text-white">
                            {ev.title} ({ev.category})
                          </span>
                          <span className="font-bold text-[#FF2E93]">
                            {percentage}% Doluluk
                          </span>
                        </div>
                        <div className="w-full bg-[#110D1D] h-4 rounded-full overflow-hidden p-0.5 border border-[#3E2F5B]">
                          <div
                            className="bg-gradient-to-r from-[#FF2E93] via-[#D946EF] to-[#9333EA] h-full rounded-full transition-all duration-1000"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 7. BİLDİRİMLER */}
            {adminTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black mb-2 text-white">
                    Bildirimler ({notifications.length})
                  </h2>
                  <p className="text-xs text-[#C4B5FD]">
                    Yönetim ve etkinlik akışına dair okunmamış anlık uyarılar.
                  </p>
                </div>

                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="bg-[#181226] border border-[#2D2342] p-5 rounded-2xl flex justify-between items-center"
                    >
                      <div>
                        <h4 className="font-bold text-sm text-white">
                          {n.title}
                        </h4>
                        <p className="text-xs text-[#C4B5FD] mt-1">{n.desc}</p>
                      </div>
                      <span className="text-[10px] text-[#FF2E93] font-mono">
                        {n.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
