const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Clearing existing data...');
    await prisma.clientRequest.deleteMany();
    await prisma.attendance.deleteMany();
    await prisma.task.deleteMany();
    await prisma.client.deleteMany();
    await prisma.employee.deleteMany();

    console.log('Seeding Employees...');
    const employees = [
        {
            firstName: 'Alice',
            lastName: 'Williams',
            email: 'alice@example.com',
            position: 'UI/UX Designer',
            department: 'Design',
            contact: '+1 555-0101',
            status: 'ON_DUTY',
            isActive: true,
            image: 'https://randomuser.me/api/portraits/women/1.jpg',
            salary: 75000,
        },
        {
            firstName: 'Bob',
            lastName: 'Johnson',
            email: 'bob@example.com',
            position: 'Project Manager',
            department: 'Management',
            contact: '+1 555-0102',
            status: 'ON_DUTY',
            isActive: true,
            image: 'https://randomuser.me/api/portraits/men/2.jpg',
            salary: 95000,
        },
        {
            firstName: 'Charlie',
            lastName: 'Brown',
            email: 'charlie@example.com',
            position: 'Backend Developer',
            department: 'Engineering',
            contact: '+1 555-0103',
            status: 'OFF_DUTY',
            isActive: true,
            image: 'https://randomuser.me/api/portraits/men/3.jpg',
            salary: 85000,
        },
        {
            firstName: 'Diana',
            lastName: 'Prince',
            email: 'diana@example.com',
            position: 'Product Owner',
            department: 'Product',
            contact: '+1 555-0104',
            status: 'ON_LEAVE',
            isActive: true,
            image: 'https://randomuser.me/api/portraits/women/4.jpg',
            salary: 105000,
        },
        {
            firstName: 'Evan',
            lastName: 'Wright',
            email: 'evan@example.com',
            position: 'Frontend Developer',
            department: 'Engineering',
            contact: '+1 555-0105',
            status: 'ON_DUTY',
            isActive: true,
            image: 'https://randomuser.me/api/portraits/men/5.jpg',
            salary: 80000,
        },
    ];

    const createdEmployees = [];
    for (const emp of employees) {
        createdEmployees.push(await prisma.employee.create({ data: emp }));
    }

    console.log('Seeding Clients...');
    const clients = [
        {
            name: 'John Doe',
            company: 'Acme Corp',
            email: 'contact@acme.com',
            phone: '+1 555-0201',
            address: '123 Acme Way, Tech City',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop', // Building
        },
        {
            name: 'Jane Smith',
            company: 'Globex Inc',
            email: 'info@globex.com',
            phone: '+1 555-0202',
            address: '456 Globex Blvd, Innovation Park',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop', // Office
        },
        {
            name: 'Mike Ross',
            company: 'Pearson Specter',
            email: 'mike@ps.com',
            phone: '+1 555-0203',
            address: '789 Law St, New York',
            image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&h=400&fit=crop', // Office
        },
    ];

    const createdClients = [];
    for (const client of clients) {
        createdClients.push(await prisma.client.create({ data: client }));
    }

    console.log('Seeding Client Requests...');
    const requests = [
        {
            employeeId: createdEmployees[0].id,
            clientId: createdClients[0].id,
            status: 'PENDING',
            reason: 'Quarterly review meeting',
            location: createdClients[0].address,
        },
        {
            employeeId: createdEmployees[2].id,
            clientId: createdClients[1].id,
            status: 'APPROVED',
            reason: 'System installation',
            location: createdClients[1].address,
        },
        {
            employeeId: createdEmployees[1].id,
            clientName: 'New Startups LLC', // New client request
            status: 'PENDING',
            reason: 'Initial sales pitch',
            location: '101 Startup Alley',
        },
        {
            employeeId: createdEmployees[4].id,
            clientId: createdClients[2].id,
            status: 'REJECTED',
            rejectionReason: 'Schedule conflict',
            reason: 'Legal consultation',
            location: createdClients[2].address,
        }
    ];

    for (const req of requests) {
        await prisma.clientRequest.create({ data: req });
    }

    console.log('Seeding Attendance...');
    // Add today's attendance for some employees
    await prisma.attendance.create({
        data: {
            employeeId: createdEmployees[0].id,
            clockIn: new Date(new Date().setHours(9, 0, 0, 0)),
            status: 'PRESENT',
        }
    });

    await prisma.attendance.create({
        data: {
            employeeId: createdEmployees[2].id,
            clockIn: new Date(new Date().setHours(9, 15, 0, 0)),
            clockOut: new Date(new Date().setHours(17, 0, 0, 0)),
            status: 'PRESENT',
        }
    });

    await prisma.attendance.create({
        data: {
            employeeId: createdEmployees[3].id,
            status: 'LEAVE',
        }
    });

    console.log('Seeding Data Complete!');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
