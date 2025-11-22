// Chennai coordinates for map centering
export const CHENNAI_CENTER = {
  lat: 13.0827,
  lng: 80.2707
};

// Mock truck locations for tracking
export const mockTruckLocations = [
  {
    id: "truck-001",
    name: "GC-001",
    lat: 13.0827,
    lng: 80.2707,
    route: "Anna Nagar",
    progress: 75,
    status: "active"
  },
  {
    id: "truck-002", 
    name: "GC-002",
    lat: 13.0878,
    lng: 80.2785,
    route: "T Nagar",
    progress: 60,
    status: "active"
  },
  {
    id: "truck-003",
    name: "GC-003", 
    lat: 13.0732,
    lng: 80.2609,
    route: "Velachery",
    progress: 90,
    status: "maintenance"
  }
];

// Mock house markers for dumps management
export const mockHouseMarkers = [
  {
    id: "house-001",
    doorNumber: "DR001",
    householder: "Demo Resident",
    lat: 13.0835,
    lng: 80.2715,
    phone: "+919876543210",
    beaconScore: 80,
    status: "available"
  },
  {
    id: "house-002",
    doorNumber: "DR002", 
    householder: "Priya Sharma",
    lat: 13.0845,
    lng: 80.2725,
    phone: "+919876543212",
    beaconScore: 65,
    status: "not-available"
  },
  {
    id: "house-003",
    doorNumber: "DR003",
    householder: "Rajesh Kumar",
    lat: 13.0820,
    lng: 80.2700,
    phone: "+919876543213", 
    beaconScore: 90,
    status: "available"
  }
];

// Mock overflow reports
export const mockOverflowReports = [
  {
    id: "overflow-001",
    type: "dumps",
    location: {
      lat: 13.0840,
      lng: 80.2720,
      address: "T Nagar Junction"
    },
    reportedBy: "Demo Resident",
    reportedAt: new Date("2024-01-15T10:30:00"),
    status: "pending",
    priority: "high"
  },
  {
    id: "overflow-002",
    type: "water",
    location: {
      lat: 13.0850,
      lng: 80.2730,
      address: "Anna Nagar Main Road"
    },
    reportedBy: "Priya Sharma",
    reportedAt: new Date("2024-01-15T08:15:00"),
    status: "assigned",
    priority: "medium"
  }
];

// Mock collection history data
export const mockCollectionHistory = [
  {
    id: "history-001",
    date: "2024-01-15",
    wasteType: "General Waste",
    status: "collected",
    collector: "Rajesh Kumar"
  },
  {
    id: "history-002",
    date: "2024-01-12", 
    wasteType: "Recyclable",
    status: "collected",
    collector: "Priya Sharma"
  },
  {
    id: "history-003",
    date: "2024-01-10",
    wasteType: "Organic",
    status: "pending",
    collector: "Mohamed Ali"
  },
  {
    id: "history-004",
    date: "2024-01-08",
    wasteType: "General Waste", 
    status: "reported",
    collector: "Rajesh Kumar"
  },
  {
    id: "history-005",
    date: "2024-01-05",
    wasteType: "E-waste",
    status: "collected",
    collector: "Sakthivel M"
  }
];

// Mock collectors data
export const mockCollectors = [
  {
    id: "collector-001",
    name: "Rajesh Kumar",
    employeeId: "GC001", 
    phone: "+919876543211",
    area: "Anna Nagar",
    totalTips: 3250,
    rating: 4.8
  },
  {
    id: "collector-002",
    name: "Priya Sharma",
    employeeId: "GC002",
    phone: "+919876543212", 
    area: "T Nagar",
    totalTips: 2890,
    rating: 4.6
  },
  {
    id: "collector-003",
    name: "Mohamed Ali",
    employeeId: "GC003",
    phone: "+919876543213",
    area: "Velachery", 
    totalTips: 2650,
    rating: 4.7
  }
];

// Mock tips data
export const mockTips = [
  {
    id: "tip-001",
    from: "Demo Resident (DR001)",
    to: "Rajesh Kumar",
    amount: 50,
    date: "2024-01-15"
  },
  {
    id: "tip-002",
    from: "Priya S (DR002)", 
    to: "Rajesh Kumar",
    amount: 30,
    date: "2024-01-14"
  },
  {
    id: "tip-003",
    from: "Ahmed K (DR003)",
    to: "Mohamed Ali",
    amount: 75,
    date: "2024-01-13"
  }
];

// Mock chat messages
export const mockChats = [
  {
    id: "chat-001",
    sender: "Rajesh Kumar",
    message: "Will be there in 10 minutes",
    time: "10:30 AM",
    type: "private"
  },
  {
    id: "chat-002",
    sender: "Demo Resident",
    message: "Thank you!",
    time: "10:31 AM", 
    type: "private"
  },
  {
    id: "chat-003",
    sender: "Authority",
    message: "New collection schedule updated",
    time: "9:00 AM",
    type: "group"
  },
  {
    id: "chat-004",
    sender: "Priya Sharma",
    message: "Route completed for today",
    time: "8:45 AM",
    type: "group"
  }
];

// Mock feedback data
export const mockFeedback = [
  {
    id: "feedback-001",
    collector: "Rajesh Kumar",
    rating: 5,
    comment: "Very punctual and polite service",
    resident: "Demo Resident",
    date: "2024-01-15"
  },
  {
    id: "feedback-002",
    collector: "Priya Sharma", 
    rating: 4,
    comment: "Good service, always on time",
    resident: "Ahmed Khan",
    date: "2024-01-14"
  },
  {
    id: "feedback-003",
    collector: "Mohamed Ali",
    rating: 5,
    comment: "Excellent work and very courteous",
    resident: "Priya S",
    date: "2024-01-13"
  },
  {
    id: "feedback-004",
    collector: "Rajesh Kumar",
    rating: 3,
    comment: "Sometimes runs late but overall good",
    resident: "Ravi M", 
    date: "2024-01-12"
  }
];

// Mock distribute requests
export const mockDistributeRequests = [
  {
    id: "distribute-001",
    resident: "Demo Resident (DR001)",
    itemType: "Old Clothes",
    address: "Anna Nagar",
    status: "pending",
    requestedAt: "2024-01-15T10:00:00"
  },
  {
    id: "distribute-002", 
    resident: "Priya S (DR002)",
    itemType: "Extra Food",
    address: "T Nagar",
    status: "pending",
    requestedAt: "2024-01-15T09:30:00"
  },
  {
    id: "distribute-003",
    resident: "Ahmed K (DR003)",
    itemType: "Old Electronics",
    address: "Velachery",
    status: "accepted",
    requestedAt: "2024-01-14T15:20:00"
  }
];

// Mock broadcast messages
export const mockBroadcasts = [
  {
    id: "broadcast-001",
    message: "New collection schedule updated for Anna Nagar area",
    targetAudience: "residents",
    sentAt: "2024-01-15T09:00:00"
  },
  {
    id: "broadcast-002",
    message: "Holiday schedule announcement - No collection on Republic Day",
    targetAudience: "all",
    sentAt: "2024-01-14T18:00:00"
  }
];
