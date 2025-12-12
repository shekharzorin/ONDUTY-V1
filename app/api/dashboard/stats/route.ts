
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const [
            totalEmployees,
            activeEmployees,
            employeesOnLeave,
            totalClients,
            recentAttendance,
            recentRequests
        ] = await Promise.all([
            prisma.employee.count(),
            prisma.employee.count({ where: { status: 'ON_DUTY' } }),
            prisma.employee.count({ where: { status: 'ON_LEAVE' } }),
            prisma.client.count(),
            prisma.attendance.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { employee: true }
            }),
            prisma.clientRequest.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { employee: true }
            })
        ]);

        // Transform activities
        const activities = [
            ...recentAttendance.map(a => ({
                id: a.id,
                type: 'ATTENDANCE',
                employeeName: `${a.employee.firstName} ${a.employee.lastName}`,
                employeeImage: a.employee.image,
                title: a.status === 'PRESENT' ? 'Clocked In' : 'Clocked Out', // Simplified logic
                time: a.createdAt,
                status: a.status
            })),
            ...recentRequests.map(r => ({
                id: r.id,
                type: 'REQUEST',
                employeeName: `${r.employee.firstName} ${r.employee.lastName}`,
                employeeImage: r.employee.image,
                title: 'Client Request',
                time: r.createdAt,
                status: r.status
            }))
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);

        return NextResponse.json({
            stats: {
                totalEmployees,
                activeEmployees,
                employeesOnLeave,
                totalClients
            },
            activities
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
    }
}
