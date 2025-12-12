
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const employee = await prisma.employee.findUnique({
            where: { id: params.id },
            include: {
                attendance: { orderBy: { createdAt: 'desc' }, take: 5 },
                requests: { orderBy: { createdAt: 'desc' }, take: 5 }
            }
        });

        if (!employee) return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
        return NextResponse.json(employee);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch employee' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const { isActive, status } = body; // Update only status/active for now

        const updatedEmployee = await prisma.employee.update({
            where: { id: params.id },
            data: {
                isActive: isActive !== undefined ? isActive : undefined,
                status: status !== undefined ? status : undefined,
            }
        });

        return NextResponse.json(updatedEmployee);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.employee.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ message: 'Employee deleted' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
    }
}
