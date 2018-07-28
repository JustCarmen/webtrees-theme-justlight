<?php
/**
 * Change: default layout
 * Themes: JustLight theme
 *
 */
?>
<?php use Fisharebest\Webtrees\Auth; ?>
<?php use Fisharebest\Webtrees\DebugBar; ?>
<?php use Fisharebest\Webtrees\FlashMessages; ?>
<?php use Fisharebest\Webtrees\I18N; ?>
<?php use Fisharebest\Webtrees\Theme; ?>
<?php use Fisharebest\Webtrees\View; ?>

<!DOCTYPE html>
<html <?= I18N::htmlAttributes() ?>>
	<head>
		<meta charset="UTF-8">
		<meta name="csrf" content="<?= e(csrf_token()) ?>">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="robots" content="<?= e($meta_robots ?? 'noindex,nofollow') ?>">
		<meta name="generator" content="<?= e(WT_WEBTREES) ?>">
		<?php if ($tree !== null): ?>
			<meta name="description" content="<?= e($tree->getPreference('META_DESCRIPTION')) ?>">
		<?php endif ?>

		<title>
			<?= strip_tags($title) ?>
			<?php if ($tree !== null && $tree->getPreference('META_TITLE') !== ''): ?>
				– <?= e($tree->getPreference('META_TITLE')) ?>
			<?php endif ?>
		</title>

		<link rel="icon" href="<?= Theme::theme()::ASSET_DIR ?>favicon.png" type="image/png">
		<link rel="icon" type="image/png" href="<?= Theme::theme()::ASSET_DIR ?>favicon192.png" sizes="192x192">
		<link rel="apple-touch-icon" sizes="180x180" href="<?= Theme::theme()::ASSET_DIR ?>favicon180.png">

		<?php /* Load the theme stylesheets */ ?>
		<link rel="stylesheet" type="text/css" href="<?= e(Theme::theme()::STYLESHEET) ?>">
		<link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">

		<?= View::stack('styles') ?>

		<?= Theme::theme()->analytics() ?>

		<?= DebugBar::renderHead() ?>
	</head>

	<body class="wt-global<?= Theme::theme()->getThemeGlobalClass() ?>">
		<header class="wt-header-wrapper d-print-none px-5 mb-3">
			<div class="wt-header-container">
				<div class="row wt-header-content mb-3">
					<div class="wt-accessibility-links">
						<a class="sr-only sr-only-focusable btn btn-info btn-sm" href="#content">
							<?= /* I18N: Skip over the headers and menus, to the main content of the page */ I18N::translate('Skip to content') ?>
						</a>
					</div>

					<div class="d-flex col-12 col-lg-6 order-2 order-lg-1 mt-2">
						<div class="col wt-site-logo"></div>

						<?php if ($tree !== null): ?>
						<h1 class="col wt-site-title">
						  <a href="index.php?route=tree-page&ged=<?= e($tree->getName()) ?>"><?= e($tree->getTitle()) ?></a>
						</h1>
						<?php endif ?>
					</div>

					<div class="jc-secondary-navigation d-flex flex-row flex-nowrap col-12 col-lg-6 order-1 order-lg-2 justify-content-sm-start justify-content-md-end align-items-start">
						<div class="wt-secondary-menu d-flex">
							<ul class="nav wt-secondary-menu">
								<?= Theme::theme()->secondaryMenuContainer(Theme::theme()->secondaryMenu()) ?>
								<li class="nav-item quick-search-small d-lg-none align-self-center">
									<a class="nav-link fa fa-search" href="search.php?ged=<?= e($tree->getName()) ?>"></a>
								</li>
							</ul>
						</div>
				  
						<?php if ($tree !== null): ?>
						<div class="col wt-header-search">
							<form class="wt-header-search-form" role="search">
								<input type="hidden" name="route" value="search-quick">
								<input type="hidden" name="ged" value="<?= e($tree->getName()) ?>">
								<div class="input-group">
									<label class="sr-only" for="quick-search"><?= I18N::translate('Search') ?></label>
									<input type="search" class="form-control wt-header-search-field" id="quick-search" name="query" size="15" placeholder="<?= I18N::translate('Search') ?>">
									<span class="input-group-btn">
										<button type="submit" class="btn btn-primary wt-header-search-button">
											<i class="fas fa-search"></i>
										</button>
									</span>
								</div>
							</form>
						</div>
						<?php endif ?>
					</div>
				</div>
			</div>

			<?php if ($tree !== null): ?>
			<nav class="jc-primary-navigation px-0">
				<ul class="nav nav-pills wt-primary-menu justify-content-start">
					<?php foreach (Theme::theme()->primaryMenu($individual ?? $tree->significantIndividual(Auth::user())) as $menu): ?>
						<?= $menu->bootstrap4() ?>
					<?php endforeach ?>
				</ul>
			</nav>
			<?php endif ?>
		</header>

		<?= Theme::theme()->fancyImagebar(); ?>
	  
		<main id="content" class="container<?= Theme::theme()->setFluidClass() ?> wt-main-wrapper mt-3">
			<div class="wt-main-container">
				<div class="flash-messages">
					<?php foreach (FlashMessages::getMessages() as $message): ?>
						<div class="alert alert-<?= e($message->status) ?> alert-dismissible" role="alert">
							<button type="button" class="close" data-dismiss="alert" aria-label="<?= I18N::translate('close') ?>">
								<span aria-hidden="true">&times;</span>
							</button>
							<?= $message->text ?>
						</div>
					<?php endforeach ?>
				</div>

				<?= $content ?>
			</div>
		</main>

		<footer class="wt-footer-container bg-faded py-3">
			<div class="jc-footer-content d-flex align-items-end d-print-none">
				<div class="jc-footer-item col-md-4 text-left">
					<?= Theme::theme()->formatContactLinks() ?>
				</div>

				<div class="jc-footer-item col-md-4 text-center">
					<?php if ($page_hits ?? 0 > 0): ?>
					<div class="wt-page-views">
						<?= I18N::plural(
	'This page has been viewed %s time.',
	'This page has been viewed %s times.',
	$page_hits,
						'<span class="odometer">' . I18N::digits($page_hits) . '</span>'
) ?>
					</div>
					<?php endif ?>
				</div>

				<div class="jc-footer-item col-md-4 text-right">
					<div class="credits d-flex flex-column"><?= Theme::theme()->logoPoweredBy() . Theme::theme()->designerUrl() ?></div>
				</div>
			</div>
		</footer>
		<div class="flash-messages">
			<?php if (Theme::theme()->cookieWarning()): ?>
			<?= Theme::theme()->htmlAlert(Theme::theme()->cookieWarning(), 'info', true) ?>
			<?php endif ?>
		</div>
	  
		<script src="<?= e(WT_ASSETS_URL . 'js/vendor.js') ?>?<?= filemtime(WT_ROOT . WT_ASSETS_URL . 'js/vendor.js') ?>"></script>
		<script src="<?= e(WT_ASSETS_URL . 'js/webtrees.js') ?>?<?= filemtime(WT_ROOT . WT_ASSETS_URL . 'js/webtrees.js') ?>"></script>		
		
		<script>
			var AUTH_ID = "<?= Auth::id() ?>";
			var COLORBOX_ACTION_FILE = "themes/<?= Theme::theme()::THEME_DIR ?>/resources/colorbox.php";
			var WT_BASE_URL = "<?= WT_BASE_URL ?>";
		</script>

		<script src="<?= e(Theme::theme()::JAVASCRIPT) ?>"></script>

		<?= View::stack('javascript') ?>

		<?= DebugBar::render() ?>
	</body>
</html>
