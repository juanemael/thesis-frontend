import React from 'react'

const MembersList = React.lazy(() => import('./views/member/Member'))
const AdminsList = React.lazy(() => import('./views/admin/Admin'))
const AdminCreate = React.lazy(() => import('./views/admin/AdminForm'))
const MemberCreate = React.lazy(() => import('./views/member/MemberForm'))
const MemberVerification = React.lazy(() => import('./views/member/MemberVerification'))
const MemberDetail = React.lazy(() => import('./views/member/MemberDetail'))
const MemberUpdate = React.lazy(() => import('./views/member/MemberUpdate'))
const SpecializationList = React.lazy(() => import('./views/specialization/Specialization'))
const SpecializationCreate = React.lazy(() => import('./views/specialization/SpecializationForm'))
const LanguageList = React.lazy(() => import('./views/language/Language'))
const LanguageCreate = React.lazy(() => import('./views/language/LanguageForm'))
const DashboardList = React.lazy(() => import('./views/dashboard/Dashboard'))
const ActivityList = React.lazy(() => import('./views/activity/Activity'))
const ActivityCreate = React.lazy(() => import('./views/activity/ActivityForm'))
const TransactionList = React.lazy(() => import('./views/transaction/TransactionList'))
const ActivityDetail = React.lazy(() => import('./views/activity/ActivityDetail'))
const EditActivityForm = React.lazy(() => import('./views/activity/ActivityFormUpdate'))
const CertificateList = React.lazy(() => import('./views/certificate/CertificateList'))
const ContentList = React.lazy(() => import('./views/content/Content'))
const ContentCreate = React.lazy(() => import('./views/content/ContentForm'))
const ContentUpdate = React.lazy(() => import('./views/content/ContentUpdate'))
const SertifikasiHalalList = React.lazy(() => import('./views/sertifikasi_halal/Sertifikasi_Halal'))

const routes = [
    { path: '/', name: 'Home', component: DashboardList, exact:true },
    { path: '/members', name: 'Members', component: MembersList },
    { path: '/member-verification/:id', name: 'Members', component: MemberVerification },
    { path: '/member-detail/:id', name: 'Members', component: MemberDetail },
    { path: '/member-detail/:id/participants', name: 'Members', component: ActivityDetail },
    { path: '/member-detail/:id/certificates', name: 'Members', component: CertificateList },
    { path: '/member-update/:id', name: 'Members Update', component: MemberUpdate },


    { path: '/admins', name: 'Admins', component: AdminsList },
    { path: '/specializations', name: 'Specializations', component: SpecializationList },
    { path: '/admin/create', name: 'Admin Create', component: AdminCreate },
    { path: '/admin/update', name: 'Admin Update', component: AdminCreate },
    { path: '/member/create', name: 'Member Create', component: MemberCreate },
    { path: '/specialization/create', name: 'Specializations', component: SpecializationCreate },
    { path: '/languages', name: 'Languages', component: LanguageList },
    { path: '/language/create', name: 'Languages Create', component: LanguageCreate },
    { path: '/dashboard', name: 'Dashboard', component: DashboardList },

    { path: '/transaction', name: 'Transaction', component: TransactionList },

    { path: '/contents', name: 'Contents', component: ContentList},
    { path: '/content/create', name: 'Contents Create', component: ContentCreate},
    { path: '/content/update/:id', name: 'Contents Update', component: ContentUpdate},

    { path: '/activities', name: 'Activities', component: ActivityList, exact: true },
    { path: '/activity/create', name: 'Create Activity', component: ActivityCreate },
    { path: '/activity/:id/certificates', name: 'Activity Certificates', component: CertificateList },
    { path: '/activity/:id/edit', name: 'Edit Activity', component: EditActivityForm },
    { path: '/activity/:id', name: 'Activity Detail', component: ActivityDetail },

    { path: '/sertifikasi_halals', name: 'Sertifikasi Halal', component: SertifikasiHalalList },
]

export default routes
