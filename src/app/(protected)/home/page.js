import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import { authOptions } from '@/app/auth';
import { redirect } from 'next/navigation';
import HomeView from '@/components/home/HomeView';
import { metadataConfig } from '@/lib/metadata';


const fetchUserProfile = async (id) => {
    const [rows] = await db.execute(`
        SELECT u.id, u.username, u.email, u.profile_photo
        FROM users u
        WHERE u.id = ?
    `, [id]);
    if (rows[0] && rows[0].profile_photo) {
        const base64Photo = Buffer.from(rows[0].profile_photo).toString('base64');
        rows[0].profile_photo = `data:image/jpeg;base64,${base64Photo}`; // You can adjust the MIME type if needed
    }
    return rows[0];
};

export const metadata = metadataConfig.home;

export default async function HomePage() {

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        
        return (
        <>
            <HomeView userProfile={null} />
        </>
    );
        
    }
    
    // Determine user role and fetch the necessary data

    const { id } = session.user;

    const userProfile = await fetchUserProfile(id);

    
    return (
        <>
            <HomeView userProfile={userProfile} />
        </>
    );
}
