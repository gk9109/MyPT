import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const DietRouter = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('בודק התחברות...');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setStatus('נמצא משתמש. בודק תפקיד...');

        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const role = userSnap.data().role;
            setStatus(`משתמש הוא ${role}, מנווט...`);
            setTimeout(() => {
              if (role === 'coach') navigate('/coach-nutrition');
              else if (role === 'client') navigate('/trainee-nutrition');
              else navigate('/login');
            }, 1000);
          } else {
            const subClientRef = doc(db, 'sub-clients', user.uid);
            const subClientSnap = await getDoc(subClientRef);

            if (subClientSnap.exists()) {
              const role = subClientSnap.data().role;
              setStatus(`משתמש הוא ${role}, מנווט...`);
              setTimeout(() => {
                navigate('/trainee-nutrition');
              }, 1000);
            } else {
              setStatus('לא נמצא במסד. מעביר ל־/login');
              setTimeout(() => {
                navigate('/login');
              }, 1000);
            }
          }
        } catch (error) {
          setStatus(`שגיאה: ${error.message}`);
        }
      } else {
        setStatus('לא נמצא משתמש. מנווט ל־/login...');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>{status}</h2>
    </div>
  );
};

export default DietRouter;
