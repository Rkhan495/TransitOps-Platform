import {
  Truck,
  CheckCircle2,
  Wrench,
  Route,
  Users,
  Activity,
} from "lucide-react";

export const dashboardKPIs = [
  {
    id: 1,
    title: "Active Vehicles",
    value: 53,
    icon: Truck,
    trend: "+12%",
    trendType: "up",
    description: "Compared to last week",
  },
  {
    id: 2,
    title: "Available Vehicles",
    value: 41,
    icon: CheckCircle2,
    trend: "+5%",
    trendType: "up",
    description: "Ready for dispatch",
  },
  {
    id: 3,
    title: "Maintenance",
    value: 8,
    icon: Wrench,
    trend: "-3%",
    trendType: "down",
    description: "Under servicing",
  },
  {
    id: 4,
    title: "Active Trips",
    value: 28,
    icon: Route,
    trend: "+18%",
    trendType: "up",
    description: "Trips currently running",
  },
  {
    id: 5,
    title: "Drivers On Duty",
    value: 35,
    icon: Users,
    trend: "+4%",
    trendType: "up",
    description: "Currently available",
  },
  {
    id: 6,
    title: "Fleet Utilization",
    value: "82%",
    icon: Activity,
    trend: "+6%",
    trendType: "up",
    description: "Operational efficiency",
  },
];

export const vehicleStatusData = [
  {
    name: "Available",
    value: 41,
    color: "#22C55E",
  },
  {
    name: "On Trip",
    value: 28,
    color: "#F97316",
  },
  {
    name: "Maintenance",
    value: 8,
    color: "#EF4444",
  },
  {
    name: "Retired",
    value: 3,
    color: "#94A3B8",
  },
];

export const monthlyTripsData = [
  {
    month: "Jan",
    trips: 120,
  },
  {
    month: "Feb",
    trips: 148,
  },
  {
    month: "Mar",
    trips: 172,
  },
  {
    month: "Apr",
    trips: 158,
  },
  {
    month: "May",
    trips: 201,
  },
  {
    month: "Jun",
    trips: 189,
  },
  {
    month: "Jul",
    trips: 224,
  },
];

export const recentTripsData = [
  {
    id: "TRP-1001",
    vehicle: "MH12AB4587",
    driver: "Rohit Sharma",
    source: "Pune",
    destination: "Mumbai",
    status: "Completed",
  },
  {
    id: "TRP-1002",
    vehicle: "MH14CD2145",
    driver: "Anjali Patil",
    source: "Nashik",
    destination: "Pune",
    status: "On Trip",
  },
  {
    id: "TRP-1003",
    vehicle: "MH20EF7890",
    driver: "Sanjay Verma",
    source: "Nagpur",
    destination: "Amravati",
    status: "Maintenance",
  },
  {
    id: "TRP-1004",
    vehicle: "MH43GH6578",
    driver: "Priya Singh",
    source: "Kolhapur",
    destination: "Satara",
    status: "Scheduled",
  },
  {
    id: "TRP-1005",
    vehicle: "MH48JK3201",
    driver: "Vikram Joshi",
    source: "Aurangabad",
    destination: "Pune",
    status: "Completed",
  },
];