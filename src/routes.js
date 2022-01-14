import {
  Receipt,
  Dashboard as DashboardIcon,
  Image,
  Work,
  Description,
  AccountBalance,
  List,
  Person,
  CheckCircleOutline,
  Payment,
  OpenInBrowser,
  InsertDriveFile,
  Business,
  LocationOn,
  SpeakerNotes,
  Event,
  FileCopy,
  WebAsset,
} from "@material-ui/icons";
import Dashboard from "views/Dashboard/Dashboard.js";
import UserProfile from "views/Pages/UserProfile.js";
import LoginPage from "views/Pages/LoginPage.js";
import Invoice from "views/Pages/Invoice";
import CreateInvoice from "views/Pages/Invoice/CreateInvoicePage";
import Quotation from "views/Pages/Quotation";
import CreateQuotation from "views/Pages/Quotation/CreateQuotationPage";
import ViewQuotation from "views/Pages/Quotation/ViewQuotation";
import Ticket from "views/Pages/Ticket";
import UserManagement from "views/Pages/UserManagement";
import PurchaseOrder from "views/Pages/PurchaseOrder";
import Jobs from "views/Pages/Jobs";
import Inventory from "views/Pages/Inventory";
import Customers from "views/Pages/Customers";
import ViewCustomer from "views/Pages/Customers/ViewCustomer";
import Checklist from "views/Pages/Checklist";
import Purchase from "views/Pages/Purchase";
import ViewInvoice from "views/Pages/Invoice/ViewInvoice";
import Importer from "views/Pages/Importer";
import Documents from "views/Pages/Documents";
import Project from "views/Pages/Project";
import EquipmentTracking from "views/Pages/Tracking";
import Report from "views/Pages/Report";
import Meeting from "views/Pages/Meeting";
import CreateJob from "views/Pages/Jobs/CreateJob";
import ViewJob from "views/Pages/Jobs/ViewJob";
import DataConfigs from "views/Pages/DataConfigs/DataConfig";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: DashboardIcon,
    component: Dashboard,
    layout: "/admin",
  },
  {
    collapse: true,
    name: "Pages",
    rtlName: "صفحات",
    hiddenFromNav: true,
    icon: Image,
    state: "pageCollapse",
    views: [
      {
        path: "/login-page",
        name: "Worxflow360",
        rtlName: "هعذاتسجيل الدخول",
        mini: "L",
        rtlMini: "هعذا",
        component: LoginPage,
        layout: "/auth",
      },
    ],
  },
  {
    collapse: true,
    name: "Jobs",
    rtlName: "خرائط",
    icon: Work,
    state: "jobCollapse",
    views: [
      {
        name: "Jobs",
        rtlName: "خرائط",
        mini: "J",
        path: "/jobs",
        component: Jobs,
        layout: "/admin",
      },
      {
        name: "Create Job",
        rtlName: "خرائط",
        mini: "CJ",
        path: "/create-job",
        component: CreateJob,
        layout: "/admin",
      },
      {
        name: "View Job",
        rtlName: "خرائط",
        mini: "VJ",
        path: "/view-job",
        component: ViewJob,
        layout: "/admin",
      },
    ],
  },
  {
    collapse: true,
    name: "File System",
    rtlName: "خرائط",
    icon: FileCopy,
    state: "fileCollapse",
    layout: "/admin",
    hiddenFromNav: true,
    views: [
      {
        name: "Report",
        rtlName: "خرائط",
        icon: SpeakerNotes,
        path: "/report",
        component: Report,
        layout: "/admin",
      },
      {
        name: "Safety Documents",
        rtlName: "خرائط",
        icon: InsertDriveFile,
        path: "/documents",
        component: Documents,
        layout: "/admin",
      },
      {
        name: "Importer",
        rtlName: "خرائط",
        icon: OpenInBrowser,
        path: "/importer",
        component: Importer,
        layout: "/admin",
      },
    ],
  },
  {
    collapse: true,
    name: "Assets",
    rtlName: "خرائط",
    icon: WebAsset,
    state: "webCollapse",
    layout: "/admin",
    hiddenFromNav: true,
    views: [
      {
        name: "Track Equipment",
        rtlName: "خرائط",
        icon: LocationOn,
        state: "ticketCollapse",
        path: "/track",
        component: EquipmentTracking,
        layout: "/admin",
      }
    ],
  },
  {
    name: "Inventory",
    rtlName: "خرائط",
    icon: AccountBalance,
    state: "inventoryCollapse",
    path: "/inventory",
    component: Inventory,
    layout: "/admin",
    roleAccess:{tech: "technician"}
  },
  {
    name: "Purchase Order",
    rtlName: "خرائط",
    icon: Receipt,
    state: "purchaseOrderCollapse",
    path: "/purchase-order",
    component: PurchaseOrder,
    layout: "/admin",
  },
  {
    collapse: true,
    name: "Quotations",
    rtlName: "خرائط",
    icon: List,
    state: "quotationCollapse",
    roleAccess:{tech: "technician"},
    views: [
      {
        path: "/quotations",
        name: "Quotations",
        rtlName: "خرائط جوجل",
        mini: "Q",
        rtlMini: "زم",
        component: Quotation,
        layout: "/admin",
        hiddenFromNav: false,
      },
      {
        path: "/create-quotation",
        name: "Create Quotation",
        rtlName: "خرائط جوجل",
        mini: "CQ",
        rtlMini: "زم",
        component: CreateQuotation,
        layout: "/admin",
        hiddenFromNav: false,
      },
      {
        path: "/view-quotation",
        name: "View Quotation",
        hiddenFromNav: true,
        rtlName: "خرائط جوجل",
        mini: "CQ",
        rtlMini: "زم",
        component: ViewQuotation,
        layout: "/admin",
        hiddenFromNav: false,
      },
    ],
  },
  {
    collapse: true,
    name: "Invoice",
    rtlName: "خرائط",
    icon: Description,
    state: "invoiceCollapse",
    views: [
      {
        path: "/invoices",
        name: "Invoices",
        rtlName: "خرائط جوجل",
        mini: "IL",
        rtlMini: "زم",
        component: Invoice,
        layout: "/admin",
      },
      {
        path: "/create-invoice",
        name: "Create Invoice",
        rtlName: "خرائط جوجل",
        mini: "CI",
        rtlMini: "زم",
        component: CreateInvoice,
        layout: "/admin",
      },
      {
        path: "/view-invoice",
        name: "View Invoice",
        hiddenFromNav: true,
        rtlName: "خرائط جوجل",
        mini: "VI",
        rtlMini: "زم",
        component: ViewInvoice,
        layout: "/admin",
      },
    ],
  },
  {
    collapse: true,
    name: "Clients",
    rtlName: "خرائط",
    icon: Person,
    state: "customerCollapse",
    roleAccess:{ super:"supervisor", tech: "technician"},
    views: [
      {
        path: "/clients",
        name: "Clients",
        rtlName: "خرائط جوجل",
        rtlMini: "زم",
        component: Customers,
        layout: "/admin",
      },
      {
        path: "/view-client",
        name: "View Client",
        rtlName: "خرائط جوجل",
        rtlMini: "زم",
        component: ViewCustomer,
        layout: "/admin",
      },
    ],
  },
  {
    name: "Project",
    rtlName: "خرائط",
    hiddenFromNav: true,
    icon: Business,
    path: "/project",
    component: Project,
    layout: "/admin",
  },
  {
    name: "Checklist",
    rtlName: "خرائط",
    hiddenFromNav: true,
    icon: CheckCircleOutline,
    path: "/checklist",
    component: Checklist,
    layout: "/admin",
  },
  {
    name: "Ticket",
    hiddenFromNav: false,
    rtlName: "خرائط",
    icon: Receipt,
    state: "ticketCollapse",
    path: "/ticket",
    component: Ticket,
    layout: "/admin",
  },
  {
    name: "Meeting",
    hiddenFromNav: true,
    rtlName: "خرائط",
    icon: Event,
    path: "/meeting",
    component: Meeting,
    layout: "/admin",
  },
  {
    name: "Purchase",
    hiddenFromNav: true,
    rtlName: "خرائط",
    icon: Payment,
    path: "/purchase",
    component: Purchase,
    layout: "/admin",
  },
  {
    collapse: true,
    name: "User Management",
    rtlName: "خرائط",
    icon: Work,
    state: "userManagementCollapse",
    roleAccess:{ super:"supervisor", tech: "technician"},
    views: [
      {
        name: "Users",
        rtlName: "خرائط",
        mini: "U",
        path: "/users",
        component: UserManagement,
        layout: "/admin",
      }   
    ]
  },
  {
    name: "Configurations",
    state: "ticketCollapse",
    path: "/configurations",
    rtlName: "ملف تعريفي للمستخدم",
    mini: "CF",
    component: DataConfigs,
    rtlMini: "شع",
    layout: "/admin",
    roleAccess:{ super:"supervisor", tech: "technician"}
  },
  {
    name: "User Profile",
    state: "ticketCollapse",
    path: "/user-page",
    rtlName: "ملف تعريفي للمستخدم",
    mini: "UP",
    rtlMini: "شع",
    component: UserProfile,
    layout: "/admin",
  },
];
export default dashRoutes;
