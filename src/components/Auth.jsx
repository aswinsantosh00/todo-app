import { useAuth } from '../hooks/useAuth';

function Auth({ isDarkMode }) {
  const { user, loading, error, signingIn, signInWithGoogle, signOut } = useAuth();

  // Get first letter for avatar
  const getInitial = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return '?';
  };

  if (loading) {
    return (
      <div className={`px-4 py-2 text-sm font-medium ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-2 text-sm font-medium text-red-500">
        {error}
      </div>
    );
  }

  if (user) {
    const initial = getInitial();
    
    return (
      <div className="flex items-center gap-2">
        {/* Mobile: Avatar (photo or initial) - matches button height */}
        <div 
          className="sm:hidden h-[42px] w-[42px] flex items-center justify-center"
          title={`${user.displayName || user.email} - Synced`}
        >
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'User'} 
              className="w-[42px] h-[42px] rounded-full border-3 border-black object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-[42px] h-[42px] rounded-full border-3 border-black bg-blue-400 flex items-center justify-center text-black font-black text-lg">
              {initial}
            </div>
          )}
        </div>
        
        {/* Desktop: Avatar + name + sync status - no background */}
        <div className="hidden sm:flex items-center gap-2" title="Syncing across devices">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'User'} 
              className="w-[54px] h-[54px] rounded-full border-3 border-black object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-[54px] h-[54px] rounded-full border-3 border-black bg-blue-400 flex items-center justify-center text-black font-black text-xl">
              {initial}
            </div>
          )}
          <div className={`flex flex-col ${isDarkMode ? 'text-gray-200' : 'text-black'}`}>
            <span className="text-sm font-medium truncate max-w-[150px]">
              {user.displayName || user.email}
            </span>
            <span className="text-xs text-green-600 font-bold">
              ☁ Synced
            </span>
          </div>
        </div>
        <button
          onClick={signOut}
          className="h-[42px] sm:h-[54px] px-3 sm:px-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-200 font-bold text-xs sm:text-sm bg-red-400 text-black flex items-center justify-center gap-1"
          aria-label="Disconnect"
          title="Disconnect (data will remain in local storage)"
        >
          <span className="sm:hidden text-[10px] uppercase tracking-wide">Disconnect</span>
          <svg className="hidden sm:block w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={signInWithGoogle}
      disabled={signingIn}
      title="Sign in to sync your tasks across all devices"
      className={`h-[42px] sm:h-[54px] px-3 sm:px-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        isDarkMode ? 'bg-blue-400 text-black' : 'bg-blue-400 text-black'
      }`}
    >
      {signingIn ? 'Signing in...' : (
      <>
        <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      </>
      )}
    </button>
  );
}

export default Auth;
