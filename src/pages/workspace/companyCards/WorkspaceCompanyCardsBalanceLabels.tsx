import React from 'react';
import {View} from 'react-native';
import useResponsiveLayout from '@hooks/useResponsiveLayout';
import useThemeStyles from '@hooks/useThemeStyles';
import WorkspaceCompanyCardsBalanceLabel from './WorkspaceCompanyCardsBalanceLabel';

type WorkspaceCompanyCardsBalanceLabelsProps = {
    /** Current balance in cents, or undefined if not available */
    currentBalance: number | undefined;

    /** Remaining credit limit in cents, or undefined if not available */
    remainingLimit: number | undefined;

    /** Output currency for display */
    currency: string;

    /** Last-updated datetime string from the backend, or undefined */
    lastUpdated: string | undefined;
};

function WorkspaceCompanyCardsBalanceLabels({currentBalance, remainingLimit, currency, lastUpdated}: WorkspaceCompanyCardsBalanceLabelsProps) {
    const styles = useThemeStyles();
    const {shouldUseNarrowLayout, isMediumScreenWidth} = useResponsiveLayout();
    const isLessThanMediumScreen = isMediumScreenWidth || shouldUseNarrowLayout;

    return (
        <View style={[isLessThanMediumScreen ? styles.flexColumn : styles.flexRow, styles.gap8, styles.ph5, styles.mt6, styles.mb6]}>
            <WorkspaceCompanyCardsBalanceLabel
                type="currentBalance"
                value={currentBalance}
                currency={currency}
                lastUpdated={lastUpdated}
            />
            <View style={styles.ml8}>
                <WorkspaceCompanyCardsBalanceLabel
                    type="remainingLimit"
                    value={remainingLimit}
                    currency={currency}
                    lastUpdated={lastUpdated}
                />
            </View>
        </View>
    );
}

export default WorkspaceCompanyCardsBalanceLabels;
