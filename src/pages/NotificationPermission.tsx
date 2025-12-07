import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, BellOff, Check } from "lucide-react";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import { useAuth } from "@/contexts/AuthContext";
import { useHaptic } from "@/hooks/useHaptic";
import { toast } from "sonner";
import { notificationManager } from "@/lib/notifications";
import { showPermissionPrompt, isOneSignalInitialized, initOneSignal } from "@/lib/onesignal";

const NotificationPermission = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { triggerHaptic } = useHaptic();
  const [isLoading, setIsLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<globalThis.NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    trackEvent("notification_permission_page_viewed");
    
    const supported = notificationManager.isSupported();
    setIsSupported(supported);
    
    if (supported) {
      setPermissionStatus(notificationManager.getPermission());
    }
  }, []);

  const navigateNext = () => {
    setTimeout(() => {
      if (user?.quiz_completed) {
        navigate("/");
      } else {
        navigate("/quiz");
      }
    }, 500);
  };

  const handleEnableNotifications = async () => {
    triggerHaptic('medium');
    setIsLoading(true);
    trackEvent("notification_permission_enable_clicked");

    try {
      // Ensure OneSignal is initialized
      if (!isOneSignalInitialized()) {
        console.log('[NotificationPermission] Initializing OneSignal...');
        await initOneSignal();
      }

      // Use OneSignal's showPermissionPrompt instead of browser's native
      console.log('[NotificationPermission] Showing OneSignal permission prompt...');
      const granted = await showPermissionPrompt(user?.id);

      if (!granted) {
        toast.error('Permission denied. You can enable later in settings.');
        setPermissionStatus('denied');
        setIsLoading(false);
        // Set flag even on denial - user was prompted
        localStorage.setItem('notification_prompted', 'true');
        navigateNext();
        return;
      }

      setPermissionStatus('granted');
      // Set flag on success
      localStorage.setItem('notification_prompted', 'true');

      // Show success notification
      await notificationManager.showNotification(
        'Notifications Enabled! 🎉',
        {
          body: "You'll receive helpful reminders and updates.",
          icon: '/icon-192.png'
        }
      );

      toast.success('Notifications enabled!');
      trackEvent("notification_permission_granted");
      navigateNext();
    } catch (error) {
      console.error('Error enabling notifications:', error);
      toast.error('Something went wrong. You can enable later in settings.');
      // Set flag even on error - user was prompted
      localStorage.setItem('notification_prompted', 'true');
      navigateNext();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    triggerHaptic('light');
    trackEvent("notification_permission_skipped");
    // Set flag on skip
    localStorage.setItem('notification_prompted', 'true');
    navigateNext();
  };

  // If already granted, skip this page
  useEffect(() => {
    if (permissionStatus === 'granted') {
      navigateNext();
    }
  }, [permissionStatus]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background via-background to-muted/10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-8 w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20"
        >
          <Bell className="w-12 h-12 text-primary" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold mb-3 text-foreground"
        >
          Stay in the Loop
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-base text-muted-foreground mb-8 px-4"
        >
          Get reminders for daily missions, streak alerts, and new scripts tailored to your child's needs.
        </motion.p>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 space-y-3 text-left px-4"
        >
          {[
            "Daily mission reminders at 9 AM",
            "Streak protection alerts at 8 PM",
            "New script notifications"
          ].map((benefit, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm text-foreground/80">{benefit}</span>
            </div>
          ))}
        </motion.div>

        {/* Not Supported Warning */}
        {!isSupported && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-muted rounded-xl"
          >
            <div className="flex items-center gap-3">
              <BellOff className="w-5 h-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-left">
                Your browser doesn't support notifications. Try using Chrome or Safari.
              </p>
            </div>
          </motion.div>
        )}

        {/* Blocked Warning */}
        {permissionStatus === 'denied' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-destructive/10 rounded-xl"
          >
            <p className="text-sm text-destructive">
              Notifications are blocked. Please enable them in your browser settings.
            </p>
          </motion.div>
        )}

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          {isSupported && permissionStatus !== 'denied' && (
            <button
              onClick={handleEnableNotifications}
              disabled={isLoading}
              className="w-full py-4 px-6 bg-primary text-primary-foreground rounded-2xl font-semibold text-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Enabling...
                </>
              ) : (
                <>
                  <Bell className="w-5 h-5" />
                  Enable Notifications
                </>
              )}
            </button>
          )}

          <button
            onClick={handleSkip}
            className="w-full py-3 text-foreground/60 hover:text-foreground transition-colors text-sm font-medium"
          >
            Skip for now
          </button>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-xs text-foreground/40"
        >
          You can change this anytime in Profile → Settings
        </motion.p>
      </motion.div>
    </div>
  );
};

export default NotificationPermission;
